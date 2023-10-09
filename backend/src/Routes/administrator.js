const express = require('express') //require or import express
const {addAdministrator,
    removeUserFromSystem,
    viewDoctorApplication,
    viewPharmacistInformation,
    viewPatientInformation} = require('../Controllers/AdminController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.post('/addAdministrator' , addAdministrator);

router.delete('/removeUserFromSystem/:id' , removeUserFromSystem);

router.get('/viewDoctorApplication' , viewDoctorApplication);

router.get('/viewPharmacistInformation' , viewPharmacistInformation);

router.get('/viewPatientInformation' , viewPatientInformation);




module.exports = router //we need to export that router at the end so that App.js can access it

