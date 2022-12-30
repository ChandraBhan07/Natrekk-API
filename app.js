const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const userRouter = require('./routes/userRouter')
const trekRouter = require('./routes/trekRouter')
const reviewRouter = require('./routes/reviewRouter')
const globalErrorHandler = require('./controllers/errorController');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// Global Middlwares

// Logging
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(helmet());
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later!'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(xss());

const hpp = require('hpp');
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}))

// Serving static files
app.use(express.static(`${__dirname}/public`));
// Routers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/treks', trekRouter);
app.use('/api/v1/reviews', reviewRouter);


// Handling undefined routes 404
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server !`
    });
});

app.use(globalErrorHandler);

module.exports = app;