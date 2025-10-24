const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  customerInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    company: String,
  },
  origin: {
    address: String,
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  destination: {
    address: String,
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  packageDetails: {
    type: {
      type: String,
      enum: ['standard', 'refrigerated', 'fragile', 'oversized', 'hazardous'],
      default: 'standard',
    },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    description: String,
  },
  serviceType: {
    type: String,
    enum: ['express', 'standard', 'economy'],
    default: 'standard',
  },
  estimatedPrice: {
    amount: Number,
    currency: {
      type: String,
      default: 'EUR',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'converted'],
    default: 'pending',
  },
  notes: String,
  adminNotes: String,
  quotedPrice: {
    amount: Number,
    currency: {
      type: String,
      default: 'EUR',
    },
    validUntil: Date,
  },
  convertedToBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Quote', quoteSchema);
