const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const guestSchema = new Schema({
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
      emergencyContact: {
        type: String,
        required: true,
       
        },
      },
  // Add any additional fields specific to guests
  // ...
 { timestamps: true });

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
