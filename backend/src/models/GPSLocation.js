const mongoose = require('mongoose');

const gpsLocationSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  speed: {
    type: Number, // km/h
    default: 0
  },
  heading: {
    type: Number, // degrees 0-360
    min: 0,
    max: 360
  },
  altitude: {
    type: Number, // meters
    default: 0
  },
  accuracy: {
    type: Number, // meters
    default: 10
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['moving', 'stopped', 'idle', 'offline'],
    default: 'moving'
  },
  address: {
    type: String // Reverse geocoded address
  },
  isSimulated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
gpsLocationSchema.index({ booking: 1, timestamp: -1 });
gpsLocationSchema.index({ vehicle: 1, timestamp: -1 });

// Virtual for route history
gpsLocationSchema.virtual('routeHistory', {
  ref: 'GPSLocation',
  localField: 'booking',
  foreignField: 'booking'
});

module.exports = mongoose.model('GPSLocation', gpsLocationSchema);
