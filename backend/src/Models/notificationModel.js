const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  recipients: [
    {
      type: String,
      required: true,
    },
  ],
  content: {
    type: String,
    required: true,
  },
  visibility: {
    type: [{
      type: String,
      enum: ['hide', 'show'],
    }],
    default: function () {
      return Array(this.recipients.length).fill('show');
    },
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
