const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

// GET all data
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      requestCount: req.requestCount,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// GET data by id
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour.length)
      return res.status(200).json({
        status: "success",
        requestCount: req.requestCount,
        data: {
          tour,
        },
      });
    else
      return res.status(404).json({
        status: "fail",
        message: "Not found",
      });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// PATCH an existing data
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      requestCount: req.requestCount,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// POST new data
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      requestCount: req.requestCount,
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// DELETE an existing data
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {
            $gte: 4.5,
          },
        },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          averageRating: { $avg: "$ratingsAverage" },
          averagePrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: {
          averagePrice: 1,
        },
      },
      // repetition in aggregation pipeline
      // {
      //   $match: {
      //     _id: {
      //       $ne: "EASY",
      //     },
      //   },
      // },
    ]);

    res.status(200).json({
      status: "success",
      requestCount: req.requestCount,
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = +req.params.year;

    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      { $addFields: { month: "$__id" } },
      { $project: { _id: 0 } },
      { $sort: { numTourStarts: -1 } },
      // { $limit: 6 },
    ]);

    res.status(200).json({
      status: "success",
      requestCount: req.requestCount,
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
