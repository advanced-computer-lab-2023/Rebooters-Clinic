const express = require('express') //require or import express
const {createPatient, createNewDoctorRequest, login , requestPasswordResetOTP , resetPasswordWithOTP} = require('../Controllers/guestController') //we're destructuring so we need curly braces

const router = express.Router() //create a router
const multer = require('multer'); 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../../frontend/public');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const upload = multer({ storage: storage });



router.post('/login', login);

router.post('/createPatient' , createPatient);

router.post('/createNewDoctorRequest', upload.fields([ { name: 'idDocument', maxCount: 1 }, { name: 'medicalLicense', maxCount: 1 }, { name: 'medicalDegree', maxCount: 1 },
  ]), createNewDoctorRequest);

router.post('/requestPasswordResetOTP', requestPasswordResetOTP);
router.post('/resetPasswordWithOTP', resetPasswordWithOTP);

module.exports = router //we need to export that router at the end so that App.js can access it
