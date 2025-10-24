const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  position: {
    type: String,
    enum: ['driver', 'logistics_coordinator', 'warehouse_staff', 'dispatcher', 'mechanic', 'other'],
    required: true,
  },
  experience: {
    years: Number,
    previousEmployers: [{
      company: String,
      position: String,
      duration: String,
      responsibilities: String,
    }],
    skills: [String],
  },
  licenses: {
    drivingLicense: {
      number: String,
      category: String,
      expiryDate: Date,
    },
    commercialLicense: {
      number: String,
      type: String,
      expiryDate: Date,
    },
    otherCertifications: [String],
  },
  availability: {
    startDate: Date,
    preferredShift: {
      type: String,
      enum: ['morning', 'afternoon', 'night', 'flexible'],
    },
    fullTime: Boolean,
  },
  documents: {
    cv: String, // file path
    coverLetter: String,
    additionalDocuments: [String],
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interview_scheduled', 'accepted', 'rejected'],
    default: 'pending',
  },
  notes: String,
  adminNotes: String,
  interviewDate: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Application', applicationSchema);
