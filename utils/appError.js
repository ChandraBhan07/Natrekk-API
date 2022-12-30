class AppError extends Error {
    constructor(errMessage, statusCode) {
        super(errMessage);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;