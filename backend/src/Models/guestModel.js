const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuestSchema = new Schema(
    {},
    {timestamps : true});

const Guest = mongoose.model('Guest', GuestSchema);
module.exports = Guest;   
