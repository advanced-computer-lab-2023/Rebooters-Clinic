const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  patient: {
     type: String, 
     default: false,
     },
  pharmacist: { 
     type: String, 
     default: "",
    },
    doctor: { 
      type: String, 
      default: "",
     },
     closed: {
      type: Boolean,
      default: false,
    },
  messages: [
    {
      username: String,
      userType: { type: String, enum: ['patient', 'pharmacist','doctor'] },
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
