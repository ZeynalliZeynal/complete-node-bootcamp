const fs = require('node:fs');

const toursPath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf8'));

// GET all data
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

// GET data by id
exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);
  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  else
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
};

// PATCH an existing data
exports.updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  else {
    const updatedTour = { ...tour, ...req.body };
    const updatedTours = tours.map((tour) =>
      tour.id === updatedTour.id ? updatedTour : tour,
    );

    fs.writeFile(toursPath, JSON.stringify(updatedTours), (err) => {
      if (err)
        return res.status(500).json({
          status: 'error',
          message: 'Failed to save the updated tour',
        });

      res.status(202).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    });
  }
};

// POST new data
exports.createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours.at(-1).id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(toursPath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

// DELETE an existing data
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);

  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  else {
    const updatedTours = tours.filter((tour) => tour.id !== +id);
    fs.writeFile(toursPath, JSON.stringify(updatedTours), (err) => {
      if (err)
        return res.status(500).json({
          status: 'error',
          message: 'Failed to delete the tour',
        });

      res.status(204).json({
        status: 'success',
        data: null,
      });
    });
  }
};
