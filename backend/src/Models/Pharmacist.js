const mongoose = require('mongoose');
const pharmacistSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  affiliation: {
    type: String,
    required: true,
  },
  OTP:{
    type: String,
    default: "",
  },
  educationalBackground: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'pending'], // Allowed values
    default: 'pending', // Default value
  },
  wallet: {
    type: Number,
    default: 0
  }
});

// Create the Pharmacist model
const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);

module.exports = Pharmacist;
