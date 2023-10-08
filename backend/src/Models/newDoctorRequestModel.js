const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AvailableSlotSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});
const newDoctorRequestSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
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
  speciality: {
    type: String,
    //required: true,
  },
  affiliation: {
    type: String,
    required: true,
  },
  educationalBackground: {
    type: String,
    required: true,
  },
  availableSlots: [AvailableSlotSchema],

  status: {
    type: String,
    enum: ['accepted', 'rejected', 'pending'], // Allowed values
    default: 'pending', // Default value
  }
}, { timestamps: true });

const NewDoctorRequest = mongoose.model('NewDoctorRequest', newDoctorRequestSchema);
module.exports = NewDoctorRequest;
