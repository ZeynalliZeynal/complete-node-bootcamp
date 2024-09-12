const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

console.log(process.env.NODE_ENV + " mode");
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log("Hello from the middleware 👋");
//   next();
// });

let requestCount = 0;
app.use((req, res, next) => {
  requestCount += 1;
  req.requestTime = new Date().toISOString();
  req.requestCount = requestCount;
  console.log(req.headers);
  next();
});

// app.get(toursApiPath, getAllTours);
// app.get(`${toursApiPath}/:id`, getTour);
// app.post(toursApiPath, createTour);
// app.patch(`${toursApiPath}/:id`, updateTour);
// app.delete(`${toursApiPath}/:id`, deleteTour);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
