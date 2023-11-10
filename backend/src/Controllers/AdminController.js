const Administrator = require('../Models/administratorModel');
const Doctor = require('../Models/doctorModel');
const Patient = require('../Models/patientModel');
const NewDoctorRequest = require('../Models/newDoctorRequestModel');
const bcrypt = require('bcrypt');
const {logout, changePassword, createToken} = require('./authController');

const mongoose = require('mongoose');
// const randomPassword = 'randompassword123'; // Replace with your random password generation logic

// // Hash the password
// bcrypt.hash(randomPassword, 10, async (err, hashedPassword) => {
//     if (err) {
//         console.error('Error hashing the password:', err);
//         return;
//     }

//     try {
//         // Create a new admin document with the hashed password
//         const admoun = new Administrator({
//             username: 'Admin123',
//             password: hashedPassword
//         });

//         // Save the new pharmacist to the database
//         await admoun.save();

//         console.log('Dummy admin created successfully.');
//     } catch (error) {
//         console.error('Error creating the dummy admin:', error);
//     }
// });

// to test admin authentication use this account on postman to login for the first time: 
// {
//   "username": "admin1",
//   "password":"Randompassword123@"
// }
// and then add another admin using the addAdministrator function

// Add another administrator with a set username and password
const addAdministrator= async (req, res) => {
      try {
        const { username, password, email } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdministrator = new Administrator({ email, username, password:hashedPassword });
        const savedAdministrator = await newAdministrator.save();
        const token = createToken(newAdministrator._id);
        res.status(201).json({ username, token, savedAdministrator });      
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding administrator' });
      }
}
  
const removeUserFromSystem = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if the user exists in the pharmacist model and delete if found
    const removedDoctor = await Doctor.findOneAndDelete({ username });

    // If the user is not a pharmacist, check the patient model and delete if found
    //if (!removedDoctor) {
      const removedPatient = await Patient.findOneAndDelete({ username });

     // if (!removedPatient) {
      const removedAdmin = await Administrator.findOneAndDelete({ username });
      //}
     // else{
       // return res.status(404).json({ message: 'User not found' });
      //}
    //}
    if (!removedDoctor && !removedPatient && !removedAdmin) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing user from the system' });
  }
};
  
    // View all information uploaded by a pharmacist to apply to join the platform
const viewDoctorApplication = async (req, res) => {
      try {
        // Fetch all pharmacist application data (customize this based on your data structure)
        const doctorApplications = await NewDoctorRequest.find({ status: 'pending' });
        res.status(200).json(doctorApplications);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching docotrs applications' });
      }
};

const viewAllPatients = async (req, res) => {
  try {
    const allPatients = await Patient.find();
    res.status(200).json(allPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

const addHealthPackage = async (req,res)=>{
  try {
    const {patientUsername, packageName} = req.body;

    // Find the patient by name
    const patient = await Patient.findOne({ username: patientUsername });
  

    if(!packageName || (packageName.toLowerCase()!="gold" && packageName.toLowerCase()!="silver" && packageName.toLowerCase()!="platinum")){
      return res.status(404).json({ error: 'Package name not found or wrong package name.' });
    }

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    
    let price = 0;
    let discountOnSession = 0;
    let discountOnMedicine = 0;
    let discountOnSubscription = 0;
    
    const healthPackage ={
      name: packageName,
      price,
      discountOnSession,
      discountOnMedicine,
      discountOnSubscription
    }



    
    if(healthPackage.name.toLowerCase() == 'silver'){
      healthPackage.price=3600;
      healthPackage.discountOnMedicine=0.4;
      healthPackage.discountOnSession=0.2;
      healthPackage.discountOnSubscription=0.1;
    }
    if(healthPackage.name.toLowerCase() == 'gold'){//make this case insensitive
      healthPackage.price=6000;
      healthPackage.discountOnMedicine=0.6;
      healthPackage.discountOnSession=0.3;
      healthPackage.discountOnSubscription=0.15;
    }
    if(healthPackage.name.toLowerCase() == 'platinum'){//make this case insensitive
      healthPackage.price=9000;
      healthPackage.discountOnMedicine=0.8;
      healthPackage.discountOnSession=0.4;
      healthPackage.discountOnSubscription=0.2;
    }
    let discount =0;
    if (patient.familyMembers && patient.familyMembers.length > 0) {
      for (let i = 0; i < patient.familyMembers.length; i++) {
        const familyMemberUsername = patient.familyMembers[i].username
        if(familyMemberUsername){
          const familyMember = await Patient.findOne({username: familyMemberUsername})
          const healthPackageDiscountOnSubscription = familyMember.healthPackage.discountOnSubscription;
          if(healthPackageDiscountOnSubscription > discount){discount = healthPackageDiscountOnSubscription}
        }
      }
    }

    healthPackage.price -= healthPackage.price * discount;
    patient.statusOfHealthPackage = 'Subscribed'
    patient.healthPackageCreatedAt = new Date()

    



    if (!patient.healthPackage){
    patient.healthPackage = healthPackage;
    await patient.save();
    
  
  }
    else {
    return res.status(404).json({ error: 'Patient already has health package.' });}



    res.json(patient);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not add health package' });
  }
  
}

const editHealthPackage = async (req,res)=>{
  try {
    const {patientUsername, packageName} = req.body;

    // Find the patient by name
    const patient = await Patient.findOne({ username: patientUsername });
  

    if(!packageName || (packageName.toLowerCase()!="gold" && packageName.toLowerCase()!="silver" && packageName.toLowerCase()!="platinum")){
      return res.status(404).json({ error: 'Package name not found or wrong package name.' });
    }

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    if(!patient.healthPackage){
      return res.status(404).json({ error: 'This patient does not have a health package.' });
    }
    
    let price = 0;
    let discountOnSession = 0;
    let discountOnMedicine = 0;
    let discountOnSubscription = 0;
    
    const healthPackage ={
      name: packageName,
      price,
      discountOnSession,
      discountOnMedicine,
      discountOnSubscription
    }



    
    if(healthPackage.name.toLowerCase() == 'silver'){//make this case insensitive
      healthPackage.price=3600;
      healthPackage.discountOnMedicine=0.4;
      healthPackage.discountOnSession=0.2;
      healthPackage.discountOnSubscription=0.1;
    }
    if(healthPackage.name.toLowerCase() == 'gold'){//make this case insensitive
      healthPackage.price=6000;
      healthPackage.discountOnMedicine=0.6;
      healthPackage.discountOnSession=0.3;
      healthPackage.discountOnSubscription=0.15;
    }
    if(healthPackage.name.toLowerCase() == 'platinum'){//make this case insensitive
      healthPackage.price=9000;
      healthPackage.discountOnMedicine=0.8;
      healthPackage.discountOnSession=0.4;
      healthPackage.discountOnSubscription=0.2;
    }

    patient.healthPackage = healthPackage;
    await patient.save();

    res.json(patient);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not edit health package' });
  }
  
}

const deleteHealthPackage = async (req,res)=>{
  try {
    const {patientUsername} = req.body;

    // Find the patient by name
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    if(!patient.healthPackage){
      return res.status(404).json({ error: 'This patient does not have a health package.' });
    }
    

    patient.healthPackage = null
    patient.statusOfHealthPackage = 'Cancelled'
    patient.healthPackageCreatedAt = new Date() //here we are setting the createdAt date to be the end date
    await patient.save();

    res.json(patient);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete health package' });
  }
  
}


const approveDoctorRequest = async (req, res) => {
  try {
    const { username } = req.body;
    const request = await NewDoctorRequest.findOne({ username: username });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'accepted';
    await request.save();

    res.status(200).json({ message: 'Request accepted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while approving the request' });
  }
};

const rejectDoctorRequest = async (req, res) => {
  try {
    const { username } = req.body;
    const request = await NewDoctorRequest.findOne({ username: username });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ message: 'Request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rejecting the request' });
  }
};




    
module.exports = {  
  addAdministrator,
  removeUserFromSystem,
  viewDoctorApplication,
  addHealthPackage,
  editHealthPackage,
  deleteHealthPackage,
  viewAllPatients,
  approveDoctorRequest,
  rejectDoctorRequest,
  logout, changePassword, 
  createToken
 }; 