const express = require('express');
const {
  createQuote,
  getAllQuotes,
  getQuote,
  updateQuote,
  deleteQuote,
} = require('../controllers/quoteController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', createQuote);
router.get('/', protect, authorize('admin'), getAllQuotes);
router.get('/:id', protect, authorize('admin'), getQuote);
router.put('/:id', protect, authorize('admin'), updateQuote);
router.delete('/:id', protect, authorize('admin'), deleteQuote);

module.exports = router;
