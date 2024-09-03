const mongoose = require("mongoose");
const tourSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Group size is required"],
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
    trim: true,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  discount: Number,
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required"],
  },
  imageCover: {
    type: String,
    required: [true, "Cover image is required"],
  },
  images: [String],
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
