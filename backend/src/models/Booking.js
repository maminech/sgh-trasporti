const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow guest bookings
  },
  trackingCode: {
    type: String,
    required: false, // Will be auto-generated
    unique: true,
    sparse: true, // Allow multiple null values during creation
  },
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
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: String,
    country: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  destination: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: String,
    country: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  packageDetails: {
    type: {
      type: String,
      enum: ['standard', 'refrigerated', 'fragile', 'oversized', 'hazardous'],
      default: 'standard',
    },
    weight: {
      type: Number,
      required: true,
    },
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
    value: Number,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
  estimatedDelivery: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed'],
    default: 'pending',
  },
  currentLocation: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    lastUpdate: Date,
  },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  price: {
    estimated: Number,
    final: Number,
    currency: {
      type: String,
      default: 'EUR',
    },
  },
  notes: String,
  internalNotes: String,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    location: String,
    notes: String,
  }],
}, {
  timestamps: true,
});

// Generate tracking code before saving
bookingSchema.pre('save', function(next) {
  if (!this.trackingCode) {
    // Generate unique tracking code: SGH + timestamp + random string
    this.trackingCode = 'SGH' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

// Add status to history when status changes
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      location: this.currentLocation?.city || '',
    });
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
