const express = require('express') //require or import express
const {viewProfile, updateProfile, viewMyPatients , 
    viewAllPatients, searchPatientByName, filterByUpcomingDate, filterByStatus, 
    selectPatient, viewMyAppointments, searchPatientByUsername , filterByDateRange, viewAllDoctors} = require('../Controllers/doctorController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.get("/doctor-profile",viewProfile);
router.post("/doctor-profile",updateProfile);
router.get("/doctor-mypatients",viewMyPatients);
router.get("/doctor-patients", viewAllPatients);

router.get("/viewAllDoctors",viewAllDoctors);

router.post("/doctor-patients", searchPatientByName);
router.post("/doctor-patients-username", searchPatientByUsername); 
router.post("/doctor-patients/upcoming-date-filter", filterByUpcomingDate);
router.post("/doctor-patients/status-filter", filterByStatus);
router.post("/doctor-select-patients", selectPatient);
router.post("/doctor-myappointments", viewMyAppointments);
router.post("/doctor-patients/date-range-filter", filterByDateRange);


module.exports = router;
