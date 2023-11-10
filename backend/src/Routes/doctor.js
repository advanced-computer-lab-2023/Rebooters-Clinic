const express = require('express') //require or import express
const { requireAuth } = require('../Middleware/authMiddleware');
const {viewProfile, updateProfile, viewMyPatients , 
    viewAllPatients, searchPatientByName, filterByUpcomingDate, filterByStatus, 
    selectPatient, viewMyAppointments, searchPatientByUsername , filterByDateRange, viewAllDoctors , 
    searchPatientPrescriptionsByName , viewWallet, filterByPastDate ,viewHealthRecords , 
    viewContract ,acceptContract , rejectContract , addAvailableSlots , scheduleAppointment , addHealthRecord, logout, changePassword } = require('../Controllers/doctorController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.get('/logout', requireAuth, logout);
router.post('/changePassword', requireAuth, changePassword);
router.post("/doctor-profile", requireAuth, viewProfile);
router.post("/doctor-update-profile", requireAuth, updateProfile);
router.post("/doctor-mypatients", requireAuth, viewMyPatients);
router.post("/doctor-patients", requireAuth, viewAllPatients);
router.get("/viewAllDoctors", requireAuth, viewAllDoctors);
router.post("/doctor-patients-name", requireAuth, searchPatientByName);
router.post("/doctor-patients-username", requireAuth, searchPatientByUsername); 
router.post("/doctor-patients/upcoming-date-filter", requireAuth, filterByUpcomingDate);
router.post("/doctor-patients/status-filter", requireAuth, filterByStatus);
router.post("/doctor-select-patients", requireAuth, selectPatient);
router.post("/doctor-myappointments", requireAuth, viewMyAppointments);
router.post("/doctor-patients/date-range-filter", requireAuth, filterByDateRange);

router.post("/doctor-patients/get-prescriptions", requireAuth, searchPatientPrescriptionsByName);

router.post("/view-wallet", requireAuth, viewWallet);
router.post("/past-appointments", requireAuth, filterByPastDate);
router.post("/get-health-records", requireAuth, viewHealthRecords);

router.get("/viewContract", requireAuth ,viewContract);
router.post("/acceptContract", requireAuth ,acceptContract);
router.post("/rejectContract", requireAuth ,rejectContract);
router.post("/addAvailableSlots", requireAuth ,addAvailableSlots);
router.post("/scheduleAppointment", requireAuth ,scheduleAppointment);
router.post("/addHealthRecord", requireAuth ,addHealthRecord);

module.exports = router;
