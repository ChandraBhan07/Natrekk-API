const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Trek = require('../models/trekModel');
const sendResponse = require('../utils/sendResponse');
const multer = require('multer');
const sharp = require('sharp');
const factory = require('../utils/factoryFunctions');

exports.getAllTreks = factory.getAll(Trek);
exports.createTrek = factory.createOne(Trek);
exports.checkTrekId = factory.checkdocId(Trek);
exports.getTrek = factory.getOne(Trek, {
    path: 'reviews',
    select: '-__v'
});
exports.updateTrek = factory.updateOne(Trek);
exports.deleteTrek = factory.deleteOne(Trek);

exports.getTreksStats = catchAsync(async (req, res, next) => {
    const stats = await Trek.aggregate([
        {
            $match: { ratingsAverage: { $gte: 1 } }
        },
        {
            $group: {
                _id: '$difficulty',
                numTreks: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRatings: { $sum: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 } // 1 for ascending
        }
    ]);
    return sendResponse(res, 200, stats);
});

exports.getMonthlyWiseTreks = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Trek.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTreksIn: { $sum: 1 },
                treks: { $push: '$name' }
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        },
        {
            // project shows and hides fields, 0-hide, 1-show
            $project: {
                _id: 0
            }
        },
        {
            $sort: {
                numTreksIn: -1 // 1 for ascending , -1 for descending
            }
        }, {
            $limit: 9 // nine documents atmost
        }
    ]);
    return sendResponse(res, 200, plan);
});

// /treks-within/100/center/32.111745,77.433491/unit/mi
exports.getTreksWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        next(new AppError('Please provide proper latitude and longitude in the format lat, lng.', 400));
    }
    const treks = await Trek.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    return sendResponse(res, 200, treks, true);
});

// /distances/24.54497662331972,73.72268230543482/unit/mi
exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng) {
        next(new AppError('Please provide proper latitude and longitude in the format lat, lng.', 400));
    }
    // geonear need only one pipline stage
    const distances = await Trek.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        }
    ]);
    return sendResponse(res, 200, distances);
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
// upload single - req.file, upload fields - req.files
exports.uploadTrekImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

exports.resizeTrekImages = catchAsync(async (req, res, next) => {
    if (req.files.imageCover) {
        // 1. Image Cover
        req.body.imageCover = `trek-${req.params.id}-${Date.now()}-cover.jpeg`;

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/treks/${req.body.imageCover}`);
    }
    // 2. Images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `trek-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

                await sharp(file.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`public/img/treks/${filename} `);

                req.body.images.push(filename);
            })
        );
    }
    next();
});

