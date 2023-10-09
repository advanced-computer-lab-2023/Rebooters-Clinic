const mongoose = require('mongoose');
const administratorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Administrator = mongoose.model('Administrator', administratorSchema);

module.exports = Administrator;
