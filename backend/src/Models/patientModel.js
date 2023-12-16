const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const FamilyMemberSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
    enum: ['Wife', 'Husband', 'Child', 'Parent'],
  },
});



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



const healthRecordSchema = new Schema({
  doctor: {
    type: String,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  }
});


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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  deliveryAddresses:[String],
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


  healthPackage: { // Add patient's health package
    type: healthPackageSchema,
    default: null,
  },
  familyMembers: [FamilyMemberSchema],
  cart: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        data: Buffer,
        contentType: String,
        filename: String,
      },
    },
  ],
orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],

  wallet: {
    type: Number,
    default: 0.0,
  },

  medicalHistory: [
    {
      data: Buffer,
      contentType: String,
      filename: String,
    },
  ],

  healthRecords: [healthRecordSchema],

  statusOfHealthPackage: {
    type: String,
    enum: ['Subscribed', 'Unsubscribed', 'Cancelled'],
    default: 'Unsubscribed'
  },
  healthPackageCreatedAt: {
    type: Date 
  },
  OTP:{
    type: String,
    default: "",
  },
  
  
 
}, { timestamps: true });

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
