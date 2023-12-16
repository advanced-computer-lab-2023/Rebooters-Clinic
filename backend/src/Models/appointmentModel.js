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
    enum: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'], 
    default: 'Upcoming',
  },
  price: {
    type: Number, 
    required: true,
  },
  payment: {
    type: String,
    enum: ['Paid', 'Unpaid'], 
    default: 'Unpaid',
    
  },
  FollowUpRequest: {
    reason: {
      type: String,
      default: "", 
    },
    preferredDate: {
      type: String,
      default: "", 
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Revoked'],
      default: 'Pending',
    },
  },
});


const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
