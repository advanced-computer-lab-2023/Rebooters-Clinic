const Guest = require('../Models/guestModel') //this imports what we exported from guestModel.js
const Patient = require('../Models/patientModel'); // Import the Patient model
const NewDoctorRequest = require('../Models/newDoctorRequestModel');
const mongoose = require('mongoose')


const createPatient = async (req, res) => {
    try {
      const {username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact} = req.body; 
      const newPatient = new Patient({username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact});
      await newPatient.save();
      res.status(201).json(newPatient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the patient.' });
    }
  };

const createNewDoctorRequest =  async (req, res) => {
  try {
    const {username,name,email,password,dateOfBirth,hourlyRate,speciality,affiliation,educationalBackground} = req.body; 
    const newDoctorRequest = new NewDoctorRequest({username,name,email,password,dateOfBirth,hourlyRate,speciality,affiliation,educationalBackground});
    await newDoctorRequest.save();
    res.status(201).json(newDoctorRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the doctor request.' });
  }
};


module.exports = {
  createPatient, createNewDoctorRequest
};

  