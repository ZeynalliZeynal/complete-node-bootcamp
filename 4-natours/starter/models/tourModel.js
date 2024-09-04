const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
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
      maxLength: [40, "Name must have minimum 40 characters"],
      minLength: [10, "Name must have maximum 10 characters"],
    },
    slug: {
      type: String,
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 1,
      min: [1, "Rating must be minimum 1.0"],
      max: [5, "Rating must be maximum 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (value) {
          //! this only points to current doc on new document creation
          return value < this.price;
        },
        message: "Discount price ({VALUE}) must be below regular price",
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// * Document middleware: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// * We can run multiple same middlewares
/*
tourSchema.pre("save", function (next) {
  console.log("Will save document...");
  next();
});

tourSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});
*/

// * query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});

// * aggregation middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: { $ne: true },
    },
  });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
