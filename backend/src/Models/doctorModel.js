const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AvailableSlotSchema = new Schema({
  datetime: {
    type: Date,
    required: true,
  },
  reservingPatientUsername: { //this attribute determines which patient reserved which slot. If null, then this slot is available
    type: String,
    default: null
  }
});
const doctorSchema = new Schema({
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
    unique: true,
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
  selectedPatients: {
    type: [String],
    required: false,
  },
  availableSlots: [AvailableSlotSchema],
  wallet: {
    type: Number,
    default: 0.0,
  },
  acceptedContract:{
    type: Boolean,
    default: false,
  },
  OTP:{
    type: String,
    default: "",
  },
  

}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
