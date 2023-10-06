const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
  patientName: String,
  doctorName: String,
  medication: String,
  dosage: String,
  instructions: String,
  date: Date,
});

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

module.exports = Prescription;
