const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const healthPackageSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true,
    },
    discountOnSession: {
      type: Number,
      required: true,
    },
    discountOnMedicine: {
      type: Number,
      required: true,
    },
    discountOnSubscription: {
      type: Number,
      required : true,
    }
      
  });

const HealthPackage = mongoose.model('HealthPackage', healthPackageSchema);
module.exports = HealthPackage;