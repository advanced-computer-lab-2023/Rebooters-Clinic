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

    
module.exports = {  
  addAdministrator,
  removeUserFromSystem,
  viewDoctorApplication,
  viewPharmacistInformation,
  viewPatientInformation,
 
 }; 