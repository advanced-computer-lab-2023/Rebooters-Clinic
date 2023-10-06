const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  doctor: {
    type: String, 
    required: true,
  },
  patient: {
    type: String, 
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Cancelled', 'Done'], 
  },
  price: {
    type: Number, 
    required: true,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
