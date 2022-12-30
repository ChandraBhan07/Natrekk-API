const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendResponse = require('../utils/sendResponse');
const multer = require('multer');
const sharp = require('sharp');
const factory = require('../utils/factoryFunctions');

exports.getAllUsers = factory.getAll(User);

exports.createUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    // undefined after create, no db transaction
    newUser.password = undefined;
    return sendResponse(res, 201, newUser);
});

exports.checkUserId = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('There is no user associated with this id.', 400));
    req.currUser = user;
    next()
})

// curr user is user other than admin(req.user)
exports.getUser = catchAsync(async (req, res, next) => sendResponse(res, 200, req.currUser));

exports.updateUser = factory.updateOne(User);

exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    return sendResponse(res, 204, null);
});

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new AppError('Not an image, please upload images only.', 400), false);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
exports.uploadUserImage = upload.single('profileImg');

exports.resizeImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user_${req.user.id}_${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename} `);

    req.body.profileImg = req.file.filename;
    next();
});
