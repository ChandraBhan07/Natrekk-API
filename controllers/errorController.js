const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const dupField = Object.keys(err.keyPattern ? err.keyPattern : err.keyValue)[0];
    const message = `Duplicate field value for ${dupField}. Please use another value!`;
    return new AppError(message, 400);
};

const handleJWTError = err => new AppError('Invalid token. Please log in again.', 401);

const handleTokenExpiredError = err => new AppError('Your token is expired. Please log in again.', 401);

const handleValidationErrorDB = err => {
    const errKeys = Object.keys(err.errors)
    return new AppError(Object.values(err.errors).map((el, i) => `${errKeys[i]} : ${el.message}`).join(','), 400)
};


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational known errors that can be sent to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        // but these are unknown errors so send generic message in production
        // separate log file can be created to store these logs but for now
        console.log('Error: ', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!. Please let us know about it.'
        });

    }
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);

    else if (process.env.NODE_ENV === 'production') {
        // Hard Copy error object
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;

        if (error.name === 'CastError') error = handleCastErrorDB(error, res);

        // Duplicate field value like trek name
        if (error.code === 11000) error = handleDuplicateFieldsDB(error, res);

        // Validation errors - stringify
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error, res);

        // Jwt
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error)
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError(error)

        sendErrorProd(error, res);
    }
}