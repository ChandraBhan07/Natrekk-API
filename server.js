const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const mongoose = require('mongoose')

process.on('uncaughtException', err => {
    console.log('Uncaught Exception! Shutting down ...');
    console.log(err.name, err.message);
})

const app = require('./app.js');

const db = process.env.DB.replace('PASSWORD', process.env.DB_PASSWORD);

mongoose.connect(db).then((con) => {
    console.log('DB connected')
})

const server = app.listen(process.env.PORT, () => {
    console.log(`App started on - 127.0.0.1:${process.env.PORT} - ${process.env.NODE_ENV}`)
});

process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection! Shutting down ...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});