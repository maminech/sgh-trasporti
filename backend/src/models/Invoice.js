const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    default: 22 // 22% VAT (Italy)
  },
  total: {
    type: Number,
    required: true
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false,
    index: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  customerDetails: {
    name: String,
    email: String,
    phone: String,
    company: String,
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    },
    vatNumber: String,
    fiscalCode: String
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'credit_card', 'cash', 'paypal', 'other'],
    default: 'bank_transfer'
  },
  paymentDate: {
    type: Date
  },
  notes: {
    type: String
  },
  pdfUrl: {
    type: String
  },
  isUploaded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate invoice number before save
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Invoice').countDocuments({
      invoiceNumber: new RegExp(`^INV-${year}`)
    });
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Calculate due date (default 30 days)
invoiceSchema.pre('save', function(next) {
  if (!this.dueDate) {
    this.dueDate = new Date(this.issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
