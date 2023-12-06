const Administrator = require("../Models/administratorModel");
const Doctor = require("../Models/doctorModel");
const Patient = require("../Models/patientModel");
const NewDoctorRequest = require("../Models/newDoctorRequestModel");
const HealthPackage = require("../Models/healthPackageModel");
const Contract = require("../Models/contractModel");
const bcrypt = require("bcrypt");
const { logout, changePassword, createToken } = require("./authController");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const addAdministrator = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdministrator = new Administrator({
      email,
      username,
      password: hashedPassword,
    });
    const savedAdministrator = await newAdministrator.save();
    const token = createToken(newAdministrator._id);
    res.status(201).json({ username, token, savedAdministrator });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding administrator" });
  }
};

const removeUserFromSystem = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if the user exists in the pharmacist model and delete if found
    const removedDoctor = await Doctor.findOneAndDelete({ username });

    // If the user is not a pharmacist, check the patient model and delete if found
    //if (!removedDoctor) {
    const removedPatient = await Patient.findOneAndDelete({ username });

    // if (!removedPatient) {
    const removedAdmin = await Administrator.findOneAndDelete({ username });
    //}
    // else{
    // return res.status(404).json({ message: 'User not found' });
    //}
    //}
    if (!removedDoctor && !removedPatient && !removedAdmin) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing user from the system" });
  }
};

// View all information uploaded by a pharmacist to apply to join the platform
const viewDoctorApplication = async (req, res) => {
  try {
    // Fetch all pharmacist application data (customize this based on your data structure)
    const doctorApplications = await NewDoctorRequest.find({
      status: "pending",
    });
    res.status(200).json(doctorApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching docotrs applications" });
  }
};

const viewAllPatients = async (req, res) => {
  try {
    const allPatients = await Patient.find();
    res.status(200).json(allPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching patients" });
  }
};

const addHealthPackage = async (req, res) => {
  try {
    const {
      name,
      price,
      discountOnSession,
      discountOnMedicine,
      discountOnSubscription,
    } = req.body;

    if (
      !name ||
      !price ||
      !discountOnSession ||
      !discountOnMedicine ||
      !discountOnSubscription
    ) {
      return res.status(404).json({ error: "Fill all fields." });
    }

    const healthPackageData = {
      name: name,
      price: price,
      discountOnSession: discountOnSession / 100,
      discountOnMedicine: discountOnMedicine / 100,
      discountOnSubscription: discountOnSubscription / 100,
    };
    const healthPackage = new HealthPackage(healthPackageData);
    await healthPackage.save();
    res.status(200).json("Successfully added Health Package");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not add health package" });
  }
};

const editHealthPackage = async (req, res) => {
  try {
    const {
      name,
      price,
      discountOnSession,
      discountOnMedicine,
      discountOnSubscription,
    } = req.body;

    if (
      !name ||
      !price ||
      !discountOnSession ||
      !discountOnMedicine ||
      !discountOnSubscription
    ) {
      return res.status(404).json({ error: "Fill all fields." });
    }

    const healthPackage = await HealthPackage.findOne({ name: name });
    if (!healthPackage) {
      return res.status(404).json({ error: "Health package not found" });
    }
    healthPackage.price = price,
    healthPackage.discountOnSession= discountOnSession / 100,
    healthPackage.discountOnMedicine= discountOnMedicine / 100,
    healthPackage.discountOnSubscription= discountOnSubscription / 100,
    await healthPackage.save();
    return res.status(200).json("Successfully edited Health Package");


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not edit health package" });
  }
};

const deleteHealthPackage = async (req, res) => {
  try {
    const { name } = req.body;

    const healthPackage = await HealthPackage.findOneAndDelete({ name: name });
    if (!healthPackage) {
      return res.status(404).json({ error: "Health package not found" });
    }
    const patientsToUpdate = await Patient.find({
      "healthPackage.name": healthPackage.name
    });

    for (const patient of patientsToUpdate) {
      patient.healthPackage = null;
      patient.statusOfHealthPackage = "Unsubscribed";
      await patient.save();
    }
    return res.status(200).json("Successfully deleted Health Package" );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete health package" });
  }
};

const approveDoctorRequest = async (req, res) => {
  try {
    const { username } = req.body;
    const request = await NewDoctorRequest.findOne({ username: username });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(request.password, salt);

    const newDoctor = new Doctor({
      username: request.username,
      password: hashedPassword,
      name: request.name,
      email: request.email,
      dateOfBirth: request.dateOfBirth,
      hourlyRate: request.hourlyRate,
      speciality: request.speciality,
      affiliation: request.affiliation,
      educationalBackground: request.educationalBackground,
    });

    request.status = "accepted";
    await newDoctor.save();

    await NewDoctorRequest.findOneAndRemove({ username: username });

    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 2);

    // Calculate salary with a 10% markup
    const salary = request.hourlyRate * 40 * 1.1;

    const newContract = new Contract({
      doctorName: request.username,
      employerName: req.cookies.username, 
      startDate: new Date(), 
      endDate: endDate, 
      salary: salary, 
      status: 'pending',
    });

    // Save the new contract
    await newContract.save();

    const emailInfo = await sendApprovalEmail(request.email);

    res.status(200).json({ message: "Request accepted", emailInfo });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while approving the request" });
  }
};

const rejectDoctorRequest = async (req, res) => {
  try {
    const { username } = req.body;
    const request = await NewDoctorRequest.findOne({ username: username });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    const emailInfo = await sendRejectionEmail(request.email);

    res.status(200).json({ message: "Request rejected", emailInfo });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while rejecting the request" });
  }
};

const sendApprovalEmail = async (email) => {
  const subject = "Doctor Application Approval";
  const html = `
    <h1>El7a2ni Doctor Application Approval</h1>
    <p>Congratulations! Your Doctor application has been approved.</p>
    <p>You are now a registered Doctor. Welcome to our platform!</p>
  `;

  const emailInfo = await sendEmail(email, subject, html);
  return emailInfo;
};

const sendRejectionEmail = async (email) => {
  const subject = "Doctor Application Rejection";
  const html = `
    <h1>El7a2ni Doctor Application Rejection</h1>
    <p>We regret to inform you that your Doctor application has been rejected.</p>
    <p>If you have any questions, please contact our support team.</p>
  `;

  const emailInfo = await sendEmail(email, subject, html);
  return emailInfo;
};

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Add this line to bypass SSL verification
      },
    });

    // Send emails to users
    let info = await transporter.sendMail({
      from: "Rebooters",
      to: email,
      subject: subject,
      html: html,
    });

    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Add this line to rethrow the error
  }
};

const viewHealthPackages = async (req, res) => {
  try {
    const healthPackages = await HealthPackage.find();
    res.json(healthPackages);
  } catch (error) {
    console.error("Error fetching health packages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addAdministrator,
  removeUserFromSystem,
  viewDoctorApplication,
  addHealthPackage,
  editHealthPackage,
  deleteHealthPackage,
  viewAllPatients,
  approveDoctorRequest,
  rejectDoctorRequest,
  logout,
  changePassword,
  createToken,
  viewHealthPackages,
};
