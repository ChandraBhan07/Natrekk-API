const express = require('express');
const trekController = require('../controllers/trekController');
const authController = require('../controllers/authController');

const reviewRouter = require('../routes/reviewRouter');

const router = express.Router();

router.route('/')
    .get(trekController.getAllTreks)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), trekController.createTrek);

router.route('/trek-stats').get(trekController.getTreksStats);
router.route('/month-wise-treks/:year').get(trekController.getMonthlyWiseTreks);

router.route('/:id')
    .get(trekController.checkTrekId, trekController.getTrek)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'),
        trekController.checkTrekId, trekController.uploadTrekImages,
        trekController.resizeTrekImages, trekController.updateTrek)
    .delete(authController.protect, authController.restrictTo('admin'), trekController.checkTrekId, trekController.deleteTrek);

router.use('/:trekId/reviews', reviewRouter);

// treks from a specific center and distance
// unit is for converting distance in radians
// kms is default option, pass mi for miles
router.route('/treks-within/:distance/center/:latlng/unit/:unit')
    .get(trekController.getTreksWithin);

// get all treks distance from specific coordinates
// /distances/24.54497662331972,73.72268230543482/unit/mi

router.route('/distances/:latlng/unit/:unit')
    .get(trekController.getDistances);


module.exports = router;