const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
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
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender:{
    type: String,
    requried: true,
  },
  mobile_number:{
    type: String,
    required: true,
  },
  emergency_contact: {
    firstName: String,
    middleName: String,
    lastName: String,
    mobile_number: String
    },
  selectedDoctors: [String],


 
  
  
 
}, { timestamps: true });

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
