const express = require('express') //require or import express
const { requireAuth } = require('../Middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const {viewAvailableDoctorSlots, unsubscribeToHealthPackage, viewHealthPackage, subscribeToHealthPackage, viewHealthPackageOptions,createNotFoundPatient, 
    viewRegisteredFamilyMembers, addFamilyMember, payForAppointment, payForHealthPackage,
    createPrescription,viewAllPrescriptions, selectDoctor,filterPrescriptions, addMedicalHistory,
    viewDoctors, findDoctor, filterDoctor, filterAppointmentsByDate, filterAppointmentsByStatus, 
    viewMyAppointments, viewWallet , filterByPastDate , viewMedicalHistory, deleteMedicalHistory,
    filterByUpcomingDate , viewHealthRecords, makeAppointment,
     logout, changePassword} = require('../Controllers/patientController'); //we're destructuring so we need curly braces


const Patient = require('../Models/patientModel'); 
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


router.get('/logout', requireAuth, logout);

// router.get('/requestPasswordResetOTP', requireAuth, requestPasswordResetOTP);

// router.post('/resetPasswordWithOTP', requireAuth, resetPasswordWithOTP);

router.post('/changePassword', requireAuth, changePassword);

router.post('/payForAppointment', requireAuth, payForAppointment);

router.post('/payForHealthPackage', requireAuth, payForHealthPackage);

router.post('/createNotFoundPatient', requireAuth, createNotFoundPatient); 

router.post('/addMedicalHistory', requireAuth, upload.array('file', 1), addMedicalHistory);

router.get('/viewMedicalHistory', requireAuth, viewMedicalHistory);

router.delete('/deleteMedicalHistory/:filename', requireAuth, deleteMedicalHistory);


//router.get('/selectDoctorByName' , selectDoctorByName);

//router.get('/ViewselectDoctorDetails' , ViewselectDoctorDetails );

router.post("/addPrescription", requireAuth, createPrescription);  

router.post("/viewAllPrescriptions", requireAuth, viewAllPrescriptions); 

router.get("/viewHealthPackageOptions", requireAuth, viewHealthPackageOptions);

router.get("/viewHealthPackage", requireAuth, viewHealthPackage);

router.post('/addFamilyMember', requireAuth, addFamilyMember);

router.post('/viewDoctors', requireAuth, viewDoctors);

router.post('/findDoctor' , requireAuth, findDoctor);

router.post('/makeAppointment',requireAuth,  makeAppointment)

router.post('/subscribeToHealthPackage', requireAuth, subscribeToHealthPackage)

router.post('/unsubscribeToHealthPackage', requireAuth, unsubscribeToHealthPackage)

router.post('/filterDoctor', requireAuth, filterDoctor);

router.post('/viewRegisteredFamilyMembers', requireAuth, viewRegisteredFamilyMembers);

router.post('/filterAppointmentsByDate', requireAuth, filterAppointmentsByDate);

router.post('/filterAppointmentsByStatus', requireAuth, filterAppointmentsByStatus);

router.post('/viewAvailableDoctorSlots' , viewAvailableDoctorSlots);

router.post('/filterPrescription', requireAuth, filterPrescriptions); 

router.get('/selectDoctor', requireAuth, selectDoctor);

router.post('/viewMyAppointments', requireAuth, viewMyAppointments);

router.post('/view-wallet', requireAuth, viewWallet);

router.post('/past-appointments', requireAuth, filterByPastDate);

router.post('/upcoming-appointments', requireAuth, filterByUpcomingDate);

router.post('/health-records', requireAuth, viewHealthRecords);





module.exports = router //we need to export that router at the end so that server.js can access it


