const mongoose = require("mongoose");
const slugify = require('slugify');

const trekSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A trek must have a name.'],
        unique: true,
        trim: true,
        minlength: [5, 'A trek name must have atleast 5 characters.'],
        maxlength: [20, 'A trek name must not have more than 20 characters.']
    },
    slug: {
        type: String
    },
    duration: {
        type: Number,
        required: [true, 'A trek must have a duration.']
    },
    difficulty: {
        type: String,
        required: [true, 'A trek must have difficulty.'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'A trek difficulty must be either: easy, medium or difficult'
        }
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A trek must have a maximum group size.']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'A trek must be rated between 1 to 5'],
        min: [1, 'A trek must be rated between 1 to 5'],
        set: val => val.toFixed(1) * 1
    },

    ratingsQuantity: {
        type: Number,
        default: 0
    },

    price: {
        type: Number,
        required: [true, 'A trek must have a price.']
    },

    priceDiscount: {
        type: Number,
        validate: {
            // only works on save or create
            validator: function (val) {
                return val < this.price;
            },
            message: "A trek discount price ({VALUE}) must be below regular price."
        }
    },

    summary: {
        type: String,
        required: [true, 'A trek must have a summary.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A trek must have a description.'],
        trim: true
    },

    imageCover: {
        type: String,
        required: [true, 'A trek must have a cover image']
    },

    images: [String],
    startDates: [Date],

    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },

    locations: [
        {// GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        },
    ],

    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

trekSchema.index({ startLocation: '2dsphere' });

// virtual property - no query on virtual property
trekSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

trekSchema.virtual('reviews', {
    ref: 'Review',
    // in review model what the field for trek id - trek
    foreignField: 'trek',
    // in local model (trek) how to relate this trek doc - tre _id
    localField: '_id'
});
// Note: We 'll populate reviews array in getTrek not getAllTreks

// Four types of middlewares in mongoose - Document, Query, Aggregate and Model
// 1. Document middleware - pre

// save will run only for .save or .create
trekSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// populate trek guides
trekSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v'
    });
    next();
});

module.exports = mongoose.model('Trek', trekSchema);