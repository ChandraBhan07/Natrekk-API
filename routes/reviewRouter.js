const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController')
const router = express.Router({ mergeParams: true });
// merge params as trekrouter will call create review but to pass trekId we use merge params in final router

router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.setUserTrekIds, reviewController.createReview);

router.route('/:id')
    .get(reviewController.checkReviewId, reviewController.getReview);

router.use(authController.protect)
    .route('/:id')
    .patch(authController.restrictTo('user'), reviewController.checkReviewId, reviewController.updateReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.checkReviewId, reviewController.deleteReview);

module.exports = router;