const ApiFeatures = require("./apiFeatures");
const AppError = require("./appError");
const catchAsync = require("./catchAsync");
const sendResponse = require("./sendResponse");

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.trekId) filter.trek = req.params.trekId;
    const features = new ApiFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const docs = await features.query;
    // const reviews = await Review.find(filter);
    return sendResponse(res, 200, docs, true);
});

exports.checkdocId = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('There is no ' + `${Model.collection.collectionName}`.slice(0, -1) + ' associated with this id.', 400));
    next();
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const newdoc = await Model.create(req.body);
    sendResponse(res, 201, newdoc);
});

exports.getOne = (Model, populateOpt) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOpt) query = query.populate(populateOpt);
    const doc = await query;
    sendResponse(res, 200, doc)
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    sendResponse(res, 200, updatedDoc);
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    await Model.findByIdAndDelete(req.params.id);
    sendResponse(res, 204, null);
});
