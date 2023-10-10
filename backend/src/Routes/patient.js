const express = require('express') //require or import express
const {deleteHealthPackage, editHealthPackage, addHealthPackage, selectDoctorByName,ViewselectDoctorDetails, viewRegisteredFamilyMembers,
    createPrescription,viewAllPrescriptions, addFamilyMember, 
    viewDoctors, findDoctor, filterDoctor, filterAppointmentsByDate, filterAppointmentsByStatus, viewFamilyMembers} = require('../Controllers/patientController'); //we're destructuring so we need curly braces

const router = express.Router() //create a router    

router.get('/selectDoctorByName' , selectDoctorByName);

router.delete('/deleteHealthPackage' , deleteHealthPackage);

router.post('/editHealthPackage' , editHealthPackage);

router.post('/addHealthPackage' , addHealthPackage);

router.get('/ViewselectDoctorDetails' , ViewselectDoctorDetails );

router.post('/createPrescription' , createPrescription);

router.get('/viewAllPrescriptions', viewAllPrescriptions);

router.post('/addFamilyMember/', addFamilyMember);

router.get('/viewDoctors', viewDoctors);

router.get('/findDoctor' , findDoctor);

router.get('/filterDoctor' , filterDoctor);

router.get('/viewRegisteredFamilyMembers' , viewRegisteredFamilyMembers);

router.get('/filterAppointmentsByDate', filterAppointmentsByDate);

router.get('/filterAppointmentsByStatus', filterAppointmentsByStatus);

module.exports = router //we need to export that router at the end so that server.js can access it


