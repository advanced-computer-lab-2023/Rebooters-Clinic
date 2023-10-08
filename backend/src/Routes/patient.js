const express = require('express') //require or import express
const {selectDoctorByName,ViewselectDoctorDetails,
    createPrescription,viewAllPrescriptions, addFamilyMember, 
    viewDoctors, findDoctor, filterDoctor} = require('../Controllers/patientController'); //we're destructuring so we need curly braces

const router = express.Router() //create a router    

router.get('/selectDoctorByName' , selectDoctorByName);

router.get('/ViewselectDoctorDetails' , ViewselectDoctorDetails );

router.post('/createPrescription' , createPrescription);

router.get('/viewAllPrescriptions', viewAllPrescriptions);

router.post('/addFamilyMember', addFamilyMember);

router.get('/viewDoctors', viewDoctors);

router.get('/findDoctor' , findDoctor);

router.get('/filterDoctor' , filterDoctor);

module.exports = router //we need to export that router at the end so that server.js can access it


