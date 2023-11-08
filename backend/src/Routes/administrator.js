const express = require('express') //require or import express
const { requireAuth } = require('../Middleware/authMiddleware');
const {addAdministrator,
    removeUserFromSystem,
    viewDoctorApplication,
    deleteHealthPackage, editHealthPackage, addHealthPackage, viewAllPatients,approveDoctorRequest,rejectDoctorRequest, logout, changePassword} = require('../Controllers/AdminController') //we're destructuring so we need curly braces

const router = express.Router() //create a router

router.get('/logout', requireAuth, logout);

// router.get('/requestPasswordResetOTP', requireAuth, requestPasswordResetOTP);

// router.post('/resetPasswordWithOTP', requireAuth, resetPasswordWithOTP);

router.post('/changePassword', requireAuth, changePassword);

router.post('/addAdministrator' , requireAuth, addAdministrator);

router.delete('/removeUserFromSystem' , requireAuth, removeUserFromSystem);

router.get('/viewDoctorApplication' , requireAuth, viewDoctorApplication);

router.delete('/deleteHealthPackage' , requireAuth, deleteHealthPackage);

router.post('/editHealthPackage' , requireAuth, editHealthPackage);

router.post('/addHealthPackage' , requireAuth, addHealthPackage);

router.get('/viewAllPatients' , requireAuth, viewAllPatients);

router.post('/approveDoctorRequest' , requireAuth, approveDoctorRequest);

router.post('/rejectDoctorRequest' , requireAuth, rejectDoctorRequest);





module.exports = router //we need to export that router at the end so that App.js can access it

