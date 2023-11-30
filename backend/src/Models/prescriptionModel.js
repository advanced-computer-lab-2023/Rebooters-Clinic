  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const PrescriptionSchema = new Schema({
    patientName: String,
    doctorName: String,
    doctorUsername: String,
    medicationInfo: [
      {
        medicine: String,
        dosage: String,
        instructions: String,
      }
    ],

    filled: {
      type: Boolean,
      default: false, 
    },

    date: {
      type: Date,
      required: true,
    },
  });

  const Prescription = mongoose.model('Prescription', PrescriptionSchema);

  module.exports = Prescription;
