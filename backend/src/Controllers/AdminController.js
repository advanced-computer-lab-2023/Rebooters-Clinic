const Administrator = require('../Models/administratorModel');
const Doctor = require('../Models/doctorModel');
const Patient = require('../Models/patientModel');
const NewDoctorRequest = require('../Models/newDoctorRequestModel');

const mongoose = require('mongoose');

    // Add another administrator with a set username and password
const addAdministrator= async (req, res) => {
      try {
        const { username, password } = req.body;
        const newAdministrator = new Administrator({ username, password });
        const savedAdministrator = await newAdministrator.save();
        res.status(201).json(savedAdministrator);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding administrator' });
      }
}
  
    // Remove a pharmacist or patient from the system
const removeUserFromSystem =  async (req, res) => {
      try {
        const {id} = req.params; // ID of the pharmacist or patient to remove
        // Check if the user is a pharmacist or patient and remove accordingly
        //const removedUser = await (Pharmacist.findOneAndRemove(userId) || Patient.findOneAndRemove(userId));
        const removedUserDoctor = await Doctor.findOneAndDelete({_id : id});
        const removedUserPatient = await Patient.findOneAndDelete({_id : id});  
        const removedAdmin = await Administrator.findOneAndDelete({_id : id});  

        
        if (removedUserDoctor==null && removedUserPatient==null && removedAdmin==null) {
          return res.status(404).json({ message: 'User not found' });
        }
        else{
        res.status(200).json({ message: 'User removed successfully' });
      }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing user from the system' });
      }
}
  
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



    // View a pharmacist's information
const viewPharmacistInformation = async (req, res) => {
      try {
        const pharmacist = await Pharmacist.find({});
        if (!pharmacist) {
          return res.status(404).json({ message: 'Pharmacists not found' });
        }
        res.status(200).json(pharmacist);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pharmacist information' });
      }
}
  
    // View a patient's basic information
const viewPatientInformation = async (req, res) => {
      try {
        
        const patient = await Patient.find({});
        if (!patient) {
          return res.status(404).json({ message: 'Patients not found' });
        }
        
        res.status(200).json(patient);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching patient information' });
      }
}

const addHealthPackage = async (req,res)=>{
  try {
    const {patientUsername , packageName} = req.body;
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

  const price = 0;
  const discountOnMedicine = 0;
  const discountOnSession = 0;
  const discountOnSubscription = 0;
  if(packageName=="silver"){ //make this a lowercase
    price = 3600;
    discountOnSession = 0.4;
    discountOnMedicine = 0.2;
    discountOnSubscription = 0.1;
  }  
if(packageName=="Platinum"){
    price = 6000;
    discountOnSession = 0.6;
    discountOnMedicine = 0.3;
    discountOnSubscription = 0.15;
}
if(packageName=="Gold"){
  price = 9000;
  discountOnSession = 0.8;
  discountOnMedicine = 0.4;
  discountOnSubscription = 0.2;
}

const familyMembers = patient.familyMembers;
familyMembers.forEach((familyMember) => {
  if(familyMember.healthPackage){
    familyMember.healthPackage.price = price - (price*discountOnSubscription);
  }
});




  // Create a new HealthPackage object
  const healthPackage = {
    packageName,
    price,

  };

    // Add the family member to the patient's familyMembers array
    patient.familyMembers.push(familyMember);

    // Save the updated patient document
    const updatedPatient = await patient.save();

    res.status(201).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add family member' });
  }
};

  



    
module.exports = {  
  addAdministrator,
  removeUserFromSystem,
  viewDoctorApplication,
  viewPharmacistInformation,
  viewPatientInformation,
 
 }; 