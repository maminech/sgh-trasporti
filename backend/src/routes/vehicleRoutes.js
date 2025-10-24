const express = require('express');
const {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllVehicles);
router.get('/:id', protect, authorize('admin'), getVehicle);
router.post('/', protect, authorize('admin'), createVehicle);
router.put('/:id', protect, authorize('admin'), updateVehicle);
router.delete('/:id', protect, authorize('admin'), deleteVehicle);

module.exports = router;
