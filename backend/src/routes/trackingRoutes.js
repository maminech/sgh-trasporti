const express = require('express');
const {
  trackShipment,
  updateLocation,
} = require('../controllers/trackingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:code', trackShipment);
router.put('/:id/location', protect, authorize('admin', 'driver'), updateLocation);

module.exports = router;
