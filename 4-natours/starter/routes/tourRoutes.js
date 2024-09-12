const express = require("express");
const controller = require("../controllers/tourController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/stats").get(controller.getTourStats);
router.route("/monthly-plan/:year").get(controller.getMonthlyPlan);

router.route("/top-5").get(controller.aliasTopTours, controller.getAllTours);

router
  .route("/")
  .get(authController.protect, controller.getAllTours)
  .post(controller.createTour);
router
  .route("/:id")
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
