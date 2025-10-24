const express = require('express');
const {
  getBookingGPSHistory,
  getCurrentLocation,
  getVehicleGPSHistory,
  getActiveFleetLocations,
  startGPSSimulation,
  stopGPSSimulation,
  getActiveSimulations,
  recordGPSLocation
} = require('../controllers/gpsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route - tracking by booking ID (requires tracking code verification in controller)
router.get('/booking/:bookingId/current', getCurrentLocation);

// Protected routes - require authentication
router.use(protect);

// Customer and Admin can view booking GPS history
router.get('/booking/:bookingId', getBookingGPSHistory);

// Driver can record GPS location
router.post('/location', authorize('driver', 'admin'), recordGPSLocation);

// Admin only routes
router.get('/vehicle/:vehicleId', authorize('admin'), getVehicleGPSHistory);
router.get('/fleet/active', authorize('admin'), getActiveFleetLocations);

// Simulation routes (Admin only)
router.post('/simulate/:bookingId/start', authorize('admin'), startGPSSimulation);
router.post('/simulate/:bookingId/stop', authorize('admin'), stopGPSSimulation);
router.get('/simulate/active', authorize('admin'), getActiveSimulations);

module.exports = router;
