const Review = require("../models/reviewModel");
const factory = require('../utils/factoryFunctions');

exports.getAllReviews = factory.getAll(Review);

exports.setUserTrekIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.trek) req.body.trek = req.params.trekId;
    next();
};

exports.createReview = factory.createOne(Review);
exports.checkReviewId = factory.checkdocId(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
