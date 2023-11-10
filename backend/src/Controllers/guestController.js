const Guest = require('../Models/guestModel'); //this imports what we exported from guestModel.js
const Patient = require('../Models/patientModel'); // Import the Patient model
const Admin = require('../Models/administratorModel');
const Doctor = require('../Models/doctorModel');
const NewDoctorRequest = require('../Models/newDoctorRequestModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {createToken} = require('./authController');
const {requestPasswordResetOTP, resetPasswordWithOTP } = require('./authController');
const maxAge = 3 * 24 * 60 * 60;

const login = async(req, res) => {
  const { username, password } = req.body;
  try {
    let user;
    type = "";

    // Search for the username in Patients
    user = await Patient.findOne({ username });
    type = "patient";
    if (!user) {
        // Search for the username in Admins
        user = await Admin.findOne({ username });
        type = "admin";
    }
    if (!user) {
        // Search for the username in Pharmacists
        user = await Doctor.findOne({ username });
        type = "doctor";
    }

    if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const token = createToken(user.username);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.cookie('userType', type, { httpOnly: true, maxAge: maxAge * 1000 });
            res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ username, token, type});
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }

        //DO REDIRECTING ACCORDING TO TYPE

    } else {
        res.status(401).json({ error: 'User not found' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in.' });
}
};


const createPatient = async (req, res) => {
    try {
      const {username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact} = req.body; 
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newPatient = new Patient({username,name,email,password:hashedPassword,dateOfBirth,gender,mobile_number,emergency_contact});
      await newPatient.save();
      const token = createToken(newPatient._id);
      res.status(200).json({username, token});
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
  createPatient, createNewDoctorRequest, login, createToken , requestPasswordResetOTP , resetPasswordWithOTP
};

  