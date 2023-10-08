const express = require('express') //require or import express
const {viewProfile, updateProfile, viewMyPatients , 
    viewAllPatients, searchPatientByName, filterByDate, filterByStatus, 
    selectPatient, viewMyAppointments, searchPatientByUsername} = require('../Controllers/doctorController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.get("/doctor-profile",viewProfile);
router.post("/doctor-profile",updateProfile);
router.get("/doctor-mypatients",viewMyPatients);
router.get("/doctor-patients", viewAllPatients);
router.get("/doctor-patients", searchPatientByName); //testing here
router.post("/doctor-patients-username", searchPatientByUsername); 
router.post("/doctor-patients/date-filter", filterByDate);
router.post("/doctor-patients/status-filter", filterByStatus);
router.post("/doctor-select-patients", selectPatient);
router.post("/doctor-myappointments", viewMyAppointments);


module.exports = router;
