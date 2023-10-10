const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const FamilyMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nationalId: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  relation: {
    type: String,
    required: true,
    enum: ['Wife', 'Husband', 'Child'],
  },
});



const healthPackageSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['Gold', 'Silver', 'Platinum'],
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
  },





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

  healthPackage: { // Add patient's health package
    type: healthPackageSchema,
    default: null,
  },
  familyMembers: [FamilyMemberSchema],

 
  
  
 
}, { timestamps: true });

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
