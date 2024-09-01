const fs = require('node:fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

let requestCount = 0;
app.use((req, res, next) => {
  requestCount += 1;
  req.requestTime = new Date().toISOString();
  req.requestCount = requestCount;
  next();
});

// app.get(toursApiPath, getAllTours);
// app.get(`${toursApiPath}/:id`, getTour);
// app.post(toursApiPath, createTour);
// app.patch(`${toursApiPath}/:id`, updateTour);
// app.delete(`${toursApiPath}/:id`, deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
