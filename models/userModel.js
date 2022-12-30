const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

// user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password.'],
        minlength: [6, 'Password should contain atleast 6 characters.'],
        maxlength: [16, 'Password should not contain more than 16 characters.'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            // This validator will only word for .create or .save 
            validator: function (val) {
                return val === this.password
            },
            message: 'Both passwords does not match.'
        }
    },
    profileImg: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpiresAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

// encrypt password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 14);
    this.passwordConfirm = undefined;
    next();
});

// check password
userSchema.methods.checkPassword = async (inpPass, origPass) => {
    return await bcrypt.compare(inpPass, origPass);
}

// if token is stolen and user then changed password
userSchema.methods.changedPasswordAfterTokenTheft = function (JWTIssuedAt) {
    if (this.passwordChangedAt) {
        const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTIssuedAt < changedAt;
    }
    return false;
}

// forgot password
userSchema.methods.createResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // 10 mins in ms
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

// filter, fetch active users
userSchema.pre(/^find/, function (next) {
    this.find({ isActive: { $ne: false } });
    next();
});

module.exports = mongoose.model('User', userSchema);