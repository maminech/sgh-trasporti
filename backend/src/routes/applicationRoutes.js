const express = require('express');
const {
  submitApplication,
  getAllApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitApplication);
router.get('/', protect, authorize('admin'), getAllApplications);
router.get('/:id', protect, authorize('admin'), getApplication);
router.put('/:id', protect, authorize('admin'), updateApplication);
router.delete('/:id', protect, authorize('admin'), deleteApplication);

module.exports = router;
