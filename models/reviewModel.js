const mongoose = require('mongoose');
const Trek = require('./trekModel');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty.'],
        trim: true
    },

    rating: {
        type: Number,
        required: [true, 'A review must contain a rating.'],
        min: [1, 'A review must be rated between 1 to 5'],
        max: [5, 'A review must be rated between 1 to 5']
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user.']
    },

    trek: {
        type: mongoose.Schema.ObjectId,
        ref: 'Trek',
        required: [true, 'A review must belong to a trek.']
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// its important to have reviews on treks but not populating treks on reviews 
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name profileImg'
    });
    // this.populate({
    //     path: 'trek',
    //     select: 'name'
    // });
    next();
});

// Calculating reatingsAverage and ratingsQuantity 
// reviewSchema.methods.testMethod - adds instance methods, this points to doc 
// reviewSchema.statics.testMethod - adds methods on model, this points to model 
reviewSchema.statics.calcRatingsAverage = async function (trekId) {
    // this points to model, aggregate is called on model
    const stats = await this.aggregate([
        {
            $match: { trek: trekId }
        },
        {
            $group: {
                _id: '$trek',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    await Trek.findByIdAndUpdate(trekId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    });

};

// compound Indexing - one user can only review a trek only once.
reviewSchema.index({ user: 1, trek: 1 }, { unique: true });

// we'll call calcRatingAverage on post as doc will contain current review after post hook
reviewSchema.post('save', function () {
    // this here points to doc but calcRatingAverage is static method not instace
    // here we cant call Review as its yet not defined
    // so a nice trick is to call constructor
    this.constructor.calcRatingsAverage(this.trek);
});

// Now in case of updating or deletting reviews calcRating must be run everytime
// we update or delete by findByIdAndUpdate or ..Delete, findOneAnd is short for findByIdAnd
// Note : in this situation we need to run query middlware, it doesnt have access to doc
// So we cant use constructor.calcRating
// Solution is we run pre query middlware then run post query middleware but,
// Note: In post query m. query is already executed so we no longer have our query
// So only fix to this problem is to pass query from pre to post by defining a property as model is a class
// Note: findByIdAnd cant be used, findOneAnd will work
reviewSchema.pre(/^findOneAnd/, async function (next) {
    //findOne is not factory function we defined but mongoose fx
    this.r = await this.findOne().clone();
    next();
});
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcRatingsAverage(this.r.trek);
});

module.exports = mongoose.model('Review', reviewSchema);