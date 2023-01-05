const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { promisify } = require('util'); // inbuild function
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    let resObj = {
        status: 'success',
        token
    };
    if (statusCode === 201) resObj.data = { user };

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json(resObj);
}

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    newUser.password = undefined;
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Email and password both are required.', 400));
    }

    // Check for correct credentials
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) return next(new AppError('Incorrect credentials', 400));

    const result = await user.checkPassword(password, user.password);
    if (!result) return next(new AppError('Incorrect credentials', 400));
    createSendToken(user, 200, res);

});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('Please login to get access.', 401));

    // 2. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // decoded contains - id(payload) + iat(issued at) + exp(timestamp)

    // 3. Get the user from id
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) return next(new AppError('The user belonging to this token dose not exists', 401));

    // 4. In case of token theft user can change password, so we have to check it.
    if (freshUser.changedPasswordAfterTokenTheft(decoded.iat)) {
        return next(new AppError('User recently changed password. Please log in again', 401));
    }
    req.user = freshUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. Check email in req body
    const { email } = req.body;
    if (!email) return next(new AppError('Please provide email address to reset your password!', 400));

    // 2. Get user
    const user = await User.findOne({ email });
    if (!user) return next(new AppError('There is no user associated with that email address.', 404));

    // 3. Generate the random reset token
    const resetToken = user.createResetToken();

    await user.save({ validateBeforeSave: false });


    // send to user email req.protocol - http / https
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n\nIf you didn't forgot the password, please ignore this email!`;

    try {
        await new Email(user, resetURL).sendResetURL(message);

        res.status(200).json({
            status: 'success', message: 'Token sent to your email.'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiresIn = undefined;
        await user.save({ validationBeforeSave: false });

        return next(new AppError('There was an error sending the email. Please try again later.', 500))
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1. Check for reset token and passwords
    if (!req.params.token) return next(new AppError('Reset token is missing, please check the link sent in your email.', 400));
    const { password, passwordConfirm } = req.body;

    if (!password) return next(new AppError('Please provide your new password.', 400));
    if (password !== passwordConfirm) return next(new AppError('Please match password with it\'s confirmation.', 400));

    // 2. Create hashed version of resetToken
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) return next(new AppError('Token is invalid or has expired. Please try again.', 400));

    // 3. If token is not expired we set the new password
    user.password = password;
    user.passwordConfirm = passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 4. Update passwordChangedAt property
    const now = Date.now();
    user.passwordChangedAt = now;

    await user.save();

    // 5. Send jwt token to log the user in
    createSendToken(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    // 1. Match both passwords
    if (!req.body.passwordCurrent) return next(new AppError('Please provide your current password for verification.', 400));
    if (!req.body.password) return next(new AppError('Please provide your new password.', 400));
    if (req.body.password !== req.body.passwordConfirm) return next(new AppError('Password and confirm password do not match.', 400));
    console.log('updatepassword', req.body.passwordCurrent, req.body.password, req.body.passwordConfirm);
    // 2. Get User from collection
    const user = await User.findById(req.user.id).select('+password');
    console.log('updatepassword before', user.password);
    // 3. Check if posted current password is correct
    if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is incorrect.', 401));
    }
    // 4. update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    console.log('updatepassword after', user);
    user.save();
    createSendToken(user, 200, res);
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1. Create error if user posts password data
    if (req.body.password || req.body.paswordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updatePassword instead.', 400));
    }
    // 2. Update user document
    if (!Object.keys(req.body).length) return next(new AppError('Please provide a field to be updated.', 400));

    const filteredBody = filterObj(req.body, 'name', 'email', 'profileImg');
    if (req.file) filteredBody.profileImg = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.me = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};


