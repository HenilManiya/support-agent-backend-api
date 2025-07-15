const express = require('express');
const router = express.Router();
const TourController = require('../controllers/tourController');
const { middleware } = require('../middleware/middleware');

// POST /api/save-tour
router.post('/save-tour',middleware.auth,  TourController.saveTourSteps);
router.get('/tour-steps', TourController.getTourStepsByUrl);
router.get('/tour-details',middleware.auth, TourController.getTourDetails);
router.put("/tour-steps/:stepId", TourController.updateTourStep);
router.delete("/tours/:tourId", TourController.deleteTour);
module.exports = router;
