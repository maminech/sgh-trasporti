const express = require('express');
const {
  createInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
  getInvoiceStats
} = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only - create, update, delete
router.post('/', authorize('admin'), createInvoice);
router.put('/:id', authorize('admin'), updateInvoice);
router.delete('/:id', authorize('admin'), deleteInvoice);
router.get('/stats', authorize('admin'), getInvoiceStats);

// Customer can view own invoices, Admin can view all
router.get('/', getAllInvoices);
router.get('/:id', getInvoice);
router.get('/:id/pdf', generateInvoicePDF);

module.exports = router;
