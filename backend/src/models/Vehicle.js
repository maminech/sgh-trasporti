const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['van', 'truck', 'semi_truck', 'refrigerated', 'flatbed'],
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  brand: String,
  model: String,
  year: Number,
  capacity: {
    weight: {
      type: Number,
      required: true, // in kg
    },
    volume: Number, // in m³
  },
  specifications: {
    length: Number,
    width: Number,
    height: Number,
    hasLiftGate: Boolean,
    hasRefrigeration: Boolean,
    hasGPS: Boolean,
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'out_of_service'],
    default: 'available',
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
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  maintenance: {
    lastService: Date,
    nextService: Date,
    mileage: Number,
  },
  documents: {
    insurance: {
      number: String,
      expiryDate: Date,
      provider: String,
    },
    registration: {
      number: String,
      expiryDate: Date,
    },
  },
  images: [String],
  notes: String,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
