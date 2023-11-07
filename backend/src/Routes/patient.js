const express = require('express') //require or import express
const {unsubscribeToHealthPackage, viewHealthPackage, subscribeToHealthPackage, viewHealthPackageOptions,createNotFoundPatient, 
    viewRegisteredFamilyMembers, addFamilyMember,
    createPrescription,viewAllPrescriptions, selectDoctor,filterPrescriptions,
    viewDoctors, findDoctor, filterDoctor, filterAppointmentsByDate, filterAppointmentsByStatus, 
    viewMyAppointments, viewWallet , filterByPastDate , filterByUpcomingDate , viewHealthRecords} = require('../Controllers/patientController'); //we're destructuring so we need curly braces

const Patient = require('../Models/patientModel'); 
const router = express.Router() //create a router    

router.post('/createNotFoundPatient',createNotFoundPatient); 

//router.get('/selectDoctorByName' , selectDoctorByName);

//router.get('/ViewselectDoctorDetails' , ViewselectDoctorDetails );

router.post("/addPrescription",createPrescription);  

router.post("/viewPrescription", viewAllPrescriptions); 

router.get("/viewHealthPackageOptions",viewHealthPackageOptions);

router.get("/viewHealthPackage",viewHealthPackage);

router.post('/addFamilyMember', addFamilyMember);

router.post('/viewDoctors', viewDoctors);

router.post('/findDoctor' , findDoctor);

router.post('/subscribeToHealthPackage', subscribeToHealthPackage)

router.post('/unsubscribeToHealthPackage', unsubscribeToHealthPackage)

router.post('/filterDoctor' , filterDoctor);

router.post('/viewRegisteredFamilyMembers' , viewRegisteredFamilyMembers);

router.post('/filterAppointmentsByDate', filterAppointmentsByDate);

router.post('/filterAppointmentsByStatus', filterAppointmentsByStatus);


router.post('/filterPrescription' , filterPrescriptions); 

router.get('/selectDoctor' , selectDoctor);

router.post('/viewMyAppointments' , viewMyAppointments);

router.post('/view-wallet' , viewWallet);

router.post('/past-appointments' , filterByPastDate);

router.post('/upcoming-appointments' , filterByUpcomingDate);

router.post('/health-records' , viewHealthRecords);


module.exports = router //we need to export that router at the end so that server.js can access it


