const mongoose = require("mongoose");
const slugify = require("slugify");

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

// * document middleware
// * We can run multiple same middlewares
// tourSchema.pre("save", function (next) {
//   console.log("Will save document...");
//   next();
// });

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// * query middleware

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  console.log(docs);
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
