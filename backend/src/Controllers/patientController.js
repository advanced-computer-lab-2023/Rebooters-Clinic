const express = require("express");
const Patient = require("../Models/patientModel"); // Import the Patient model
const Doctor = require("../Models/doctorModel");
const Chat = require("../Models/chatModel");
const medicineModel = require("../Models/medicineModel");

const Prescription = require("../Models/prescriptionModel");
const Appointment = require("../Models/appointmentModel");
const HealthPackage = require("../Models/healthPackageModel");
const Notification = require("../Models/notificationModel");
const bcrypt = require("bcrypt"); //needed only for creating the dummy doctor password
const { logout, changePassword } = require("./authController");
const { createToken } = require("./authController");
const maxAge = 3 * 24 * 60 * 60;
const nodemailer = require("nodemailer");

//i put these here also instead of creating a model of familyMember
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { differenceInMonths, differenceInDays } = require("date-fns");

const createNotFoundPatient = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobile_number,
      emergency_contact,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const parsedDateOfBirth = new Date(dateOfBirth);
    const newPatient = new Patient({
      username,
      name,
      email,
      password: hashedPassword,
      dateOfBirth: parsedDateOfBirth,
      gender,
      mobile_number,
      emergency_contact,
    });
    await newPatient.save();

    res.status(200).json({ newPatient });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the patient." });
  }
};

const addFamilyMember = async (req, res) => {
  const currentUsername = req.cookies.username;
  const { familyMemberUsername, relation } = req.body;

  try {
    // Check if the current patient's username is valid
    const currentPatient = await Patient.findOne({ username: currentUsername });
    if (!currentPatient) {
      return res.status(404).json({ message: "Current patient not found" });
    }

    let i = 0;
    for (i; i < currentPatient.familyMembers.length; i++) {
      if (currentPatient.familyMembers[i].username === familyMemberUsername) {
        return res.status(400).json({ message: "Already a family member" });
      }
    }

    // Search the database to ensure that the family member's username exists
    const familyMember = await Patient.findOne({
      username: familyMemberUsername,
    });
    if (!familyMember) {
      // Redirect the user to the addPatient method (you need to implement this route)
      return res.status(404).json({
        message:
          "Family member is not registered as a patient. Please register them.",
      });
    }

    // If the family member's username is found, add an item to the array of familyMembers
    currentPatient.familyMembers.push({
      username: familyMemberUsername,
      relation,
    });
    if (relation == "Husband") {
      familyMember.familyMembers.push({
        username: currentUsername,
        relation: "Wife",
      });
    }
    if (relation == "Wife") {
      familyMember.familyMembers.push({
        username: currentUsername,
        relation: "Husband",
      });
    }
    if (relation == "Parent") {
      familyMember.familyMembers.push({
        username: currentUsername,
        relation: "Child",
      });
    }
    if (relation == "Child") {
      familyMember.familyMembers.push({
        username: currentUsername,
        relation: "Parent",
      });
    }

    // Save the updated current patient document
    await familyMember.save();
    await currentPatient.save();

    res.status(200).json({ message: "Family member added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

/*const ViewselectDoctorDetails = async (req, res) => {
  try {
    const { patientName, doctorName } = req.body;

    // Find the patient and doctor records by their names
    const patient = await Patient.findOne({ name: patientName }); // Assuming 'name' is the field that stores the patient's name in the Patient model
    const doctor = await Doctor.findOne({ name: doctorName }); // Assuming 'name' is the field that stores the doctor's name in the Doctor model

    if (!patient || !doctor) {
      return res.status(404).json({ error: 'Patient or doctor not found.' });
    }

    // Check if the selected doctor is in the patient's 'selectedDoctors' array
    const selectedDoctorIndex = patient.selectedDoctors.indexOf(doctorName);

    if (selectedDoctorIndex === -1) {
      return res.status(400).json({ error: 'Doctor is not selected by the patient.' });
    }

    // Prepare the doctor's details
    const doctorDetails = {
      name: doctor.name,
      specialty: doctor.specialty,
      hospitalAffiliation: doctor.affiliation,
      educationalBackground: doctor.educationalBackground,
    };

    res.json(doctorDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching doctor details.' });
  }
};*/

const createPrescription = async (req, res) => {
  try {
    const {
      patientName,
      doctorName,
      medication,
      dosage,
      instructions,
      prescriptionDate,
      filled,
    } = req.body;

    // Parse the prescriptionDate string into a JavaScript Date object
    const parsedPrescriptionDate = new Date(prescriptionDate);

    // Create a new prescription with the "filled" status
    const prescription = new Prescription({
      patientName,
      doctorName,
      medication,
      dosage,
      instructions,
      date: parsedPrescriptionDate,
      filled,
    });

    // Save the prescription to the database
    await prescription.save();

    res.status(201).json(prescription);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the prescription." });
  }
};

const viewAllPrescriptions = async (req, res) => {
  try {
    const patientName = req.cookies.username;

    // Find all prescriptions for the specified patient (case-insensitive)
    const prescriptions = await Prescription.find({ patientName: patientName });

    if (prescriptions.length === 0) {
      return res.json({ message: "No prescriptions found for the patient." });
    }

    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching prescriptions." });
  }
};

const viewRegisteredFamilyMembers = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const familyMembers = patient.familyMembers;
    res.status(200).json(familyMembers);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching registered family members",
    });
  }
};

const filterAppointmentsByDate = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { startDate, endDate, familyUsername } = req.body;

    let patient;
    if (familyUsername !== "" && familyUsername !== undefined) {
      patient = await Patient.findOne({ username: familyUsername });
    } else {
      patient = await Patient.findOne({ username: patientUsername });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Find all appointments for the patient between the specified dates
    const appointments = await Appointment.find({
      patient: patient.username,
      datetime: {
        $gte: new Date(startDate).setHours(0, 0, 0, 0), // Greater than or equal to the start date
        $lte: new Date(endDate).setHours(23, 59, 59, 999), // Less than or equal to the end date
      },
    });

    if (appointments.length === 0) {
      return res.json({
        message: "No appointments found between the specified dates.",
      });
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while filtering appointments by date.",
    });
  }
};

const filterAppointmentsByStatus = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { appointmentStatus, familyUsername } = req.body;

    let patient;
    if (familyUsername !== "" && familyUsername !== undefined) {
      patient = await Patient.findOne({ username: familyUsername });
    } else {
      patient = await Patient.findOne({ username: patientUsername });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Find all appointments for the patient with the specified status
    const appointments = await Appointment.find({
      patient: patient.username,
      $expr: {
        $eq: [{ $toLower: "$status" }, appointmentStatus.toLowerCase()],
      },
    });

    if (appointments.length === 0) {
      return res.json({
        message: "No appointments found with the specified status.",
      });
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while filtering appointments by status.",
    });
  }
};

const viewDoctors = async (req, res) => {
  try {
    // Extract the patient's username from the request body
    const patientUsername = req.cookies.username;

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Retrieve all doctors from the database
    const doctors = await Doctor.find({ acceptedContract: true });

    // Calculate session prices for each doctor
    const doctorsWithSessionPrices = doctors.map((doctor) => {
      let sessionPrice = doctor.hourlyRate;

      if (patient.healthPackage) {
        // Apply the discount from the patient's health package
        sessionPrice =
          doctor.hourlyRate +
          doctor.hourlyRate * 0.1 -
          patient.healthPackage.discountOnSession;
      } else {
        // If no health package, calculate session price with clinic's markup only
        sessionPrice = doctor.hourlyRate + doctor.hourlyRate * 0.1;
      }

      return {
        _id: doctor._id,
        username: doctor.username,
        name: doctor.name,
        speciality: doctor.speciality,
        educationalBackground: doctor.educationalBackground,
        affiliation: doctor.affiliation,
        dateOfBirth: doctor.dateOfBirth,
        sessionPrice,
      };
    });

    res.status(200).json(doctorsWithSessionPrices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

// Define a function for patient to search for a doctor
const findDoctor = async (req, res) => {
  try {
    const { speciality, name } = req.body;
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });

    // Build a query based on provided parameters
    const query = {};

    if (speciality) {
      query.speciality = { $regex: new RegExp(speciality, "i") }; // 'i' flag makes it case-insensitive
    }

    if (name) {
      query.name = { $regex: new RegExp(name, "i") }; // 'i' flag makes it case-insensitive
    }

    // Check if at least one search parameter is provided
    if (!speciality && !name) {
      return res.status(400).json({
        error:
          "Please provide at least one search parameter (speciality or name).",
      });
    }
    query.acceptedContract = true;

    // Use the query to search for doctors
    const doctors = await Doctor.find(query);

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No matching doctors found." });
    }

    // Return the list of matching doctors

    // Calculate session prices for each doctor
    const doctorsWithSessionPrices = doctors.map((doctor) => {
      let sessionPrice = doctor.hourlyRate;

      if (patient.healthPackage) {
        // Apply the discount from the patient's health package
        sessionPrice =
          doctor.hourlyRate +
          doctor.hourlyRate * 0.1 -
          patient.healthPackage.discountOnSession;
      } else {
        // If no health package, calculate session price with clinic's markup only
        sessionPrice = doctor.hourlyRate + doctor.hourlyRate * 0.1;
      }
      doctor.sessionPrice = sessionPrice;
      return {
        _id: doctor._id,
        username: doctor.username,
        name: doctor.name,
        speciality: doctor.speciality,
        educationalBackground: doctor.educationalBackground,
        affiliation: doctor.affiliation,
        dateOfBirth: doctor.dateOfBirth,
        sessionPrice,
      };
    });

    res.status(200).json(doctorsWithSessionPrices);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for doctors." });
  }
};

// Define a function to filter doctors by speciality and available slots
const filterDoctor = async (req, res) => {
  try {
    const { speciality, date } = req.body; // Get speciality, date, and time from the request body
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });

    if (!speciality && !date) {
      return res.status(400).json({
        error:
          "Please provide at least one search parameter (speciality, date, or time).",
      });
    }

    if (speciality && !date) {
      let filteredDoctors = await Doctor.find({
        speciality: { $regex: new RegExp(speciality, "i") },
        acceptedContract: true,
      });

      // Calculate session prices for each doctor
      const doctorsWithSessionPrices = filteredDoctors.map((doctor) => {
        let sessionPrice = doctor.hourlyRate;

        if (patient.healthPackage) {
          // Apply the discount from the patient's health package
          sessionPrice =
            doctor.hourlyRate +
            doctor.hourlyRate * 0.1 -
            patient.healthPackage.discountOnSession;
        } else {
          // If no health package, calculate session price with clinic's markup only
          sessionPrice = doctor.hourlyRate + doctor.hourlyRate * 0.1;
        }
        doctor.sessionPrice = sessionPrice;
        return {
          _id: doctor._id,
          username: doctor.username,
          name: doctor.name,
          speciality: doctor.speciality,
          educationalBackground: doctor.educationalBackground,
          affiliation: doctor.affiliation,
          dateOfBirth: doctor.dateOfBirth,
          sessionPrice,
        };
      });

      res.status(200).json(doctorsWithSessionPrices);
    } else if (!speciality && date) {
      const combinedDateTime = new Date(date);
      const doctors = await Doctor.find();
      const doctorsWithAvailableSlots = [];

      doctors.forEach((doctor) => {
        const hasAvailableSlot = doctor.availableSlots.some(
          (slot) =>
            new Date(slot.datetime).getTime() === combinedDateTime.getTime() &&
            slot.reservingPatientUsername === null
        );

        if (hasAvailableSlot && doctor.acceptedContract) {
          doctorsWithAvailableSlots.push(doctor);
        }
      });

      // Calculate session prices for each doctor
      const doctorsWithSessionPrices = doctorsWithAvailableSlots.map(
        (doctor) => {
          let sessionPrice = doctor.hourlyRate;

          if (patient.healthPackage) {
            // Apply the discount from the patient's health package
            sessionPrice =
              doctor.hourlyRate +
              doctor.hourlyRate * 0.1 -
              patient.healthPackage.discountOnSession;
          } else {
            // If no health package, calculate session price with clinic's markup only
            sessionPrice = doctor.hourlyRate + doctor.hourlyRate * 0.1;
          }
          doctor.sessionPrice = sessionPrice;
          return {
            _id: doctor._id,
            username: doctor.username,
            name: doctor.name,
            speciality: doctor.speciality,
            educationalBackground: doctor.educationalBackground,
            affiliation: doctor.affiliation,
            dateOfBirth: doctor.dateOfBirth,
            sessionPrice,
          };
        }
      );

      res.status(200).json(doctorsWithSessionPrices);
    } else if (speciality && date) {
      const combinedDateTime = new Date(date);
      const doctors = await Doctor.find();
      const doctorsWithAvailableSlots = [];

      doctors.forEach((doctor) => {
        const hasAvailableSlot = doctor.availableSlots.some(
          (slot) =>
            new Date(slot.datetime).getTime() === combinedDateTime.getTime() &&
            slot.reservingPatientUsername === null
        );

        if (hasAvailableSlot && doctor.acceptedContract) {
          doctorsWithAvailableSlots.push(doctor.username);
        }
      });
      filteredDoctors = await Doctor.find({
        speciality: { $regex: new RegExp(speciality, "i") },
        username: { $in: doctorsWithAvailableSlots },
        acceptedContract: true,
      });

      // Calculate session prices for each doctor
      const doctorsWithSessionPrices = filteredDoctors.map((doctor) => {
        let sessionPrice = doctor.hourlyRate;

        if (patient.healthPackage) {
          // Apply the discount from the patient's health package
          sessionPrice =
            doctor.hourlyRate +
            doctor.hourlyRate * 0.1 -
            patient.healthPackage.discountOnSession;
        } else {
          // If no health package, calculate session price with clinic's markup only
          sessionPrice = doctor.hourlyRate + doctor.hourlyRate * 0.1;
        }
        doctor.sessionPrice = sessionPrice;
        return {
          _id: doctor._id,
          username: doctor.username,
          name: doctor.name,
          speciality: doctor.speciality,
          educationalBackground: doctor.educationalBackground,
          affiliation: doctor.affiliation,
          dateOfBirth: doctor.dateOfBirth,
          sessionPrice,
        };
      });

      res.status(200).json(doctorsWithSessionPrices);
    } else {
      return res.status(400).json({
        error:
          "Please provide at least one search parameter (speciality or date).",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while filtering doctors." });
  }
};

const filterPrescriptions = async (req, res) => {
  try {
    const { date, doctorName, filled } = req.body; // Get date, doctorName, and filled status from the request body

    // Check if at least one filter parameter is provided
    if (!date && !doctorName && filled === undefined) {
      return res.status(400).json({
        error:
          "At least one filter parameter (date, doctorName, filled) is required.",
      });
    }

    // Create an empty query object
    const query = {};
    query.patientName = req.cookies.username;

    if (date) {
      // Parse the date string into a JavaScript Date object
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format." });
      }

      // Calculate the start and end of the day for the provided date
      const startDate = new Date(parsedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(parsedDate);
      endDate.setHours(23, 59, 59, 999);

      // Add date criteria to the query
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (doctorName) {
      // Use a case-insensitive regex to match doctorName
      query.doctorName = { $regex: new RegExp(`^${doctorName}$`, "i") };
    }

    if (filled !== undefined) {
      // Add filled criteria to the query
      query.filled = filled;
    }

    // Use the query to filter prescriptions
    const filteredPrescriptions = await Prescription.find(query);

    if (filteredPrescriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching prescriptions found." });
    }

    // Return the list of matching prescriptions
    res.status(200).json(filteredPrescriptions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while filtering prescriptions." });
  }
};

// Define a function to select a doctor from the results of findDoctor and filterDoctor
const selectDoctor = async (req, res) => {
  try {
    const { findDoctorResults, filterDoctorResults } = req.body; // Assuming you pass the results as an object in the request body

    // Combine the results of both functions into a single list of doctors
    const combinedDoctors = [...findDoctorResults, ...filterDoctorResults];

    // Check if the combined list is empty
    if (combinedDoctors.length === 0) {
      return res.status(404).json({ message: "No doctors to select from." });
    }

    // You can implement your selection logic here based on your criteria
    // For example, if you want to select the doctor with the most available slots:
    const selectedDoctor = combinedDoctors.reduce(
      (prevDoctor, currentDoctor) => {
        if (
          currentDoctor.availableSlots.length > prevDoctor.availableSlots.length
        ) {
          return currentDoctor;
        }
        return prevDoctor;
      }
    );

    // Return the selected doctor
    res.status(200).json(selectedDoctor);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while selecting a doctor." });
  }
};

const viewMyAppointments = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const myAppointments = await Appointment.find({ patient: patientUsername });
    res.status(200).json(myAppointments);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const viewWallet = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }
    const wallet = patient.wallet;
    res.status(200).json({ wallet });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the wallet" });
  }
};

const filterByPastDate = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { familyUsername } = req.body;

    let patient;
    if (familyUsername !== "" && familyUsername !== undefined) {
      patient = await Patient.findOne({ username: familyUsername });
    } else {
      patient = await Patient.findOne({ username: patientUsername });
    }
    const currentDateTime = new Date();
    const pastAppointments = await Appointment.find({
      patient: patient.username,
    });

    const filteredAppointments = pastAppointments.filter((appointment) => {
      const appointmentDateTime = new Date(appointment.datetime);
      return appointmentDateTime < currentDateTime;
    });

    filteredAppointments.sort((a, b) => {
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      return dateB - dateA;
    });

    res.status(200).json(filteredAppointments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering past appointments" });
  }
};

const filterByUpcomingDate = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { familyUsername } = req.body;

    let patient;
    if (familyUsername !== "" && familyUsername !== undefined) {
      patient = await Patient.findOne({ username: familyUsername });
    } else {
      patient = await Patient.findOne({ username: patientUsername });
    }
    const currentDateTime = new Date();
    const upcomingAppointments = await Appointment.find({
      patient: patient.username,
    });
    const filteredAppointments = upcomingAppointments.filter((appointment) => {
      const appointmentDateTime = new Date(appointment.datetime);
      return appointmentDateTime >= currentDateTime;
    });
    filteredAppointments.sort((a, b) => {
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      return dateA - dateB;
    });
    res.status(200).json(filteredAppointments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering patients" });
  }
};

const viewHealthRecords = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }

    const healthRecords = patient.healthRecords;
    if (!healthRecords || healthRecords.length === 0) {
      res
        .status(404)
        .json({ error: "No health records found for the patient" });
      return;
    }
    res.status(200).json({ healthRecords });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching health records" });
  }
};

const viewHealthPackageOptions = async (req, res) => {
  try {
    const healthPackages = await HealthPackage.find();
    res.json(healthPackages);
  } catch (error) {
    console.error("Error fetching health packages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const viewHealthPackage = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Initialize response object
    const response = {
      statusOfHealthPackage: patient.statusOfHealthPackage,
    };

    if (patient.statusOfHealthPackage === "Subscribed") {
      // Calculate the current date
      const currentDate = new Date();

      // Calculate the renewal date by adding 1 year to the MongoDB-generated 'createdAt' date
      const renewalDate = new Date(patient.healthPackageCreatedAt);
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);

      // Calculate the remaining time in months and days
      const monthsRemaining = differenceInMonths(renewalDate, currentDate);
      renewalDate.setMonth(renewalDate.getMonth() - monthsRemaining); // Subtract months from the renewalDate
      const daysRemaining = differenceInDays(renewalDate, currentDate);

      // Create a human-readable string for remaining time
      response.timeShown = `${monthsRemaining} months and ${daysRemaining} days`;
    }

    if (patient.statusOfHealthPackage === "Cancelled") {
      response.timeShown = `Cancelled at ${patient.healthPackageCreatedAt}`;
    }

    if (patient.healthPackage) {
      response.healthPackage = patient.healthPackage;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Patient does not have health package" });
  }
};

const viewFamilyMembersHealthPackages = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Initialize response object
    const familyMembersHealthPackages = [];

    // Loop through family members
    for (const familyMember of patient.familyMembers) {
      let familyMemberPatient = await Patient.findOne({
        username: familyMember.username,
      });
      const familyMemberResponse = {
        familyMemberUsername: familyMemberPatient.username,
        statusOfHealthPackage: familyMemberPatient.statusOfHealthPackage,
      };

      if (familyMemberPatient.statusOfHealthPackage === "Subscribed") {
        // Calculate the current date
        const currentDate = new Date();

        // Calculate the renewal date by adding 1 year to the MongoDB-generated 'createdAt' date
        const renewalDate = new Date(
          familyMemberPatient.healthPackageCreatedAt
        );
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);

        // Calculate the remaining time in months and days
        const monthsRemaining = differenceInMonths(renewalDate, currentDate);
        renewalDate.setMonth(renewalDate.getMonth() - monthsRemaining); // Subtract months from the renewalDate
        const daysRemaining = differenceInDays(renewalDate, currentDate);

        // Create a human-readable string for remaining time
        familyMemberResponse.timeShown = `${monthsRemaining} months and ${daysRemaining} days`;
      }

      if (familyMemberPatient.statusOfHealthPackage === "Cancelled") {
        familyMemberResponse.timeShown = `Cancelled at ${familyMemberPatient.healthPackageCreatedAt}`;
      }

      if (familyMemberPatient.healthPackage) {
        familyMemberResponse.healthPackage = familyMemberPatient.healthPackage;
      }

      familyMembersHealthPackages.push(familyMemberResponse);
    }

    res.status(200).json(familyMembersHealthPackages);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching family members' health packages" });
  }
};

const subscribeToHealthPackage = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { packageName, subscribingUser } = req.body;

    let patient;
    if (subscribingUser !== "myself") {
      patient = await Patient.findOne({ username: subscribingUser });
    } else {
      patient = await Patient.findOne({ username: patientUsername });
    }

    if (!packageName) {
      return res
        .status(404)
        .json({ error: "Package name not found or wrong package name." });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }
    const healthPackage = await HealthPackage.findOne({ name: packageName });
    if (!healthPackage) {
      return res.status(404).json({ error: "Health package not found" });
    }
    let discount = 0;
    if (patient.familyMembers && patient.familyMembers.length > 0) {
      for (let i = 0; i < patient.familyMembers.length; i++) {
        const familyMemberUsername = patient.familyMembers[i].username;
        if (familyMemberUsername) {
          const familyMember = await Patient.findOne({
            username: familyMemberUsername,
          });
          if (
            familyMember.healthPackage &&
            familyMember.healthPackage.status == "Subscribed"
          ) {
            const healthPackageDiscountOnSubscription =
              familyMember.healthPackage.discountOnSubscription;
            if (healthPackageDiscountOnSubscription > discount) {
              discount = healthPackageDiscountOnSubscription;
            }
          }
        }
      }
    }

    healthPackage.price -= healthPackage.price * discount;

    if (!patient.healthPackage) {
      patient.statusOfHealthPackage = "Subscribed";
      patient.healthPackageCreatedAt = new Date();
      patient.healthPackage = healthPackage;
      await patient.save();
    } else {
      return res
        .status(404)
        .json({ error: "Patient already has health package." });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not add health package" });
  }
};

const unsubscribeToHealthPackage = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { unsubscribingUser } = req.body;

    let patient;
    if (unsubscribingUser !== "myself") {
      patient = await Patient.findOne({ username: unsubscribingUser });
    } else {
      patient = await Patient.findOne({ username: patientUsername });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    if (!patient.healthPackage) {
      return res
        .status(404)
        .json({ error: "This patient is unsubscribed to a health package." });
    }

    patient.healthPackage = null;
    patient.statusOfHealthPackage = "Cancelled";
    patient.healthPackageCreatedAt = new Date(); //here we are setting the createdAt date to be the end date
    await patient.save();

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete health package" });
  }
};

const viewAvailableDoctorSlots = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { doctorUsername } = req.body;

    // Find the patient and doctor records by their usernames
    const patient = await Patient.findOne({ username: patientUsername });

    const doctor = await Doctor.findOne({
      username: doctorUsername,
      acceptedContract: true,
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    // Retrieve the available slots of the selected doctor
    const allAvailableSlots = doctor.availableSlots;
    const actualAvailableSlots = allAvailableSlots.filter(
      (slot) => slot.reservingPatientUsername === null
    );

    if (actualAvailableSlots.length === 0) {
      return res.json({ message: "No available slots for the doctor." });
    }

    res.status(200).json(actualAvailableSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching doctor available slots.",
    });
  }
};

const makeAppointment = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { doctorUsername, chosenSlot, reservingUser } = req.body;

    let patient;
    if (reservingUser !== "myself") {
      patient = await Patient.findOne({ username: reservingUser });
    } else {
      patient = await Patient.findOne({ username: patientUsername });
    }

    const doctor = await Doctor.findOne({
      username: doctorUsername,
      acceptedContract: true,
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    const combinedDateTime = new Date(chosenSlot.datetime);

    appointmentPrice = doctor.hourlyRate;
    if (patient.statusOfHealthPackage === "Subscribed") {
      appointmentPrice =
        doctor.hourlyRate * patient.healthPackage.discountOnSession;
    }
    const appointment = new Appointment({
      doctor: doctorUsername,
      patient: patient.username,
      datetime: combinedDateTime,
      status: "Upcoming",
      price: appointmentPrice,
    });

    let i=0;
    for(i;i<doctor.availableSlots.length;i++){
      if(doctor.availableSlots[i].datetime.getTime() === combinedDateTime.getTime()){
        doctor.availableSlots[i].reservingPatientUsername = patient.username;
      }
    }

    await doctor.save();
    await appointment.save();

    // Create a new notification
    const appointmentNotification = new Notification({
      recipients: [doctorUsername, patient.username],
      content: `New appointment for ${patient.username} with Dr. ${doctor.username} scheduled on ${combinedDateTime}.`,
    });

    // Save the notification in the database
    await appointmentNotification.save();

    const prescription = new Prescription({
      patientName: patient.username,
      doctorName: doctorUsername,
      date: combinedDateTime,
    });
    await prescription.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Email content for the patient
    const patientEmailOptions = {
      from: "Rebooters",
      to: patient.email,
      subject: "Appointment Confirmation",
      text: `Dear ${patient.username},\n\nYour appointment with Dr. ${doctorUsername} is confirmed on ${combinedDateTime}.\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Email content for the doctor
    const doctorEmailOptions = {
      from: "Rebooters",
      to: doctor.email,
      subject: "New Appointment",
      text: `Dear Dr. ${doctorUsername},\n\nYou have a new appointment with ${patient.username} on ${combinedDateTime}.\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Send emails
    await transporter.sendMail(patientEmailOptions);
    await transporter.sendMail(doctorEmailOptions);

    res
      .status(200)
      .json({ message: "Appointment made successfully.", appointment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while making the appointment." });
  }
};

const payForAppointment = async (req, res) => {
  try {
    const patientUsername = req.cookies.username; // Assuming you store the patient's username in cookies
    const { appointmentId, paymentMethod } = req.body;

    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    const foundAppointment = await Appointment.findOne({ _id: appointmentId });
    if (!foundAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    if (foundAppointment.payment === "Unpaid") {
      const appointmentPrice = foundAppointment.price;
      if (paymentMethod === "pay with my wallet") {
        if (patient.wallet >= appointmentPrice) {
          patient.wallet -= appointmentPrice;
          await patient.save();
          foundAppointment.payment = "Paid";
          await foundAppointment.save();
          return res
            .status(200)
            .json({ message: "Payment from wallet successful." });
        } else {
          return res
            .status(400)
            .json({ error: "Insufficient funds in the wallet" });
        }
      } else {
        foundAppointment.payment = "Paid";
        await foundAppointment.save();
        return res
          .status(200)
          .json({ message: "Payment from credit card successful." });
      }
    } else {
      return res.status(400).json({ error: "Appointment already paid" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment." });
  }
};

const payForHealthPackage = async (req, res) => {
  try {
    const patientUsername = req.cookies.username; // Assuming you store the patient's username in cookies
    const { packageName, paymentMethod } = req.body;

    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }
    const healthPackage = await HealthPackage.findOne({ name: packageName });
    if (!healthPackage) {
      return res.status(404).json({ error: "Health package not found" });
    }
    const price = healthPackage.price;

    if (paymentMethod === "pay with my wallet") {
      if (patient.wallet >= price) {
        patient.wallet -= price;
        await patient.save();
        return res
          .status(200)
          .json({ message: "Payment from wallet successful." });
      } else {
        return res
          .status(400)
          .json({ error: "Insufficient funds in the wallet" });
      }
    } else {
      return res
        .status(200)
        .json({ message: "Payment from credit card successful." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment." });
  }
};

const addMedicalHistory = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    if (req.files) {
      const files = req.files.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname,
      }));
      patient.medicalHistory.push(...files);
      await patient.save();

      res.status(200).json({ message: "Files uploaded successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not upload files" });
  }
};

const viewMedicalHistory = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Return the list of medical history files
    res.status(200).json(patient.medicalHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteMedicalHistory = async (req, res) => {
  try {
    const { filename } = req.params;
    const patientUsername = req.cookies.username;
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Find the index of the file with the given filename
    const fileIndex = patient.medicalHistory.findIndex(
      (file) => file.filename === filename
    );

    if (fileIndex === -1) {
      return res.status(404).json({ error: "File not found" });
    }

    // Remove the file from the array
    patient.medicalHistory.splice(fileIndex, 1);

    // Save the updated patient
    await patient.save();

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const rescheduleAppointment = async (req, res) => {
  try {
    const { datetime, doctorUsername, newdate } = req.body;
    const appointment = await Appointment.findOne({
      datetime,
      doctor: doctorUsername,
    });
    appointment.datetime = newdate;
    appointment.status = "Rescheduled";
    const patient = await Patient.findOne({ username: req.cookies.username });

    const doctor = await Doctor.findOne({ username: doctorUsername });

    for (let i = 0; i < doctor.availableSlots.length; i++) {
      if (
        doctor.availableSlots[i].datetime.getTime() == new Date(newdate).getTime()) {
        doctor.availableSlots[i].reservingPatientUsername =
          req.cookies.username;
      }
      if(doctor.availableSlots[i].datetime.getTime() == new Date(datetime).getTime()){
        doctor.availableSlots[i].reservingPatientUsername =null;
      }
    }

    const combinedDateTime = new Date(newdate);

    appointment.save();
    doctor.save();

    // Create a new notification
    const appointmentNotification = new Notification({
      recipients: [doctorUsername, patient.username],
      content: `Appointment for ${patient.username} with Dr. ${doctorUsername} has been rescheduled to ${combinedDateTime}`,
    });

    // Save the notification in the database
    await appointmentNotification.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Email content for the patient
    const patientEmailOptions = {
      from: "Rebooters",
      to: patient.email,
      subject: "Appointment Reschedule",
      text: `Dear ${patient.username},\n\nYour appointment with Dr. ${doctorUsername} has been rescheduled to ${combinedDateTime} .\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Email content for the doctor
    const doctorEmailOptions = {
      from: "Rebooters",
      to: doctor.email,
      subject: "Appointment Reschedule",
      text: `Dear Dr. ${doctorUsername},\n\n Your appointment with ${patient.username} has been rescheduled to ${combinedDateTime}.\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Send emails
    await transporter.sendMail(patientEmailOptions);
    await transporter.sendMail(doctorEmailOptions);

    res.status(200).json({ message: "Appointment rescheduled" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while rescheduling the appointment." });
  }
};
const requestFollowUp = async (req, res) => {
  try {
    const { reason, preferredDate, datetime } = req.body;
    await Appointment.updateOne(
      { datetime },
      { $set: { FollowUpRequest: { reason, preferredDate } } }
    );

    res.status(200).json({ message: "Request successfully made" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while requesting a follow-up." });
  }
};

const viewFamilyAppointments = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { familyUsername } = req.body; //view for a specific family user if its not empty string

    if (familyUsername !== "") {
      const patient = await Patient.findOne({ username: familyUsername });
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      const FamilyAppointments = await Appointment.find({
        patient: familyUsername,
      });
      return res.status(200).json(FamilyAppointments);
    }

    // Fetch the patient and their family members
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const familyMembers = patient.familyMembers;

    // Fetch appointments for each family member
    const familyAppointments = [];
    for (const familyMember of familyMembers) {
      const appointments = await Appointment.find({
        patient: familyMember.username,
      });
      familyAppointments.push({ appointments });
    }
    const flattenedAppointments = familyAppointments.reduce(
      (acc, family) => [...acc, ...family.appointments],
      []
    );

    res.status(200).json(flattenedAppointments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching family appointments" });
  }
};

const getAvailableDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching available doctors" });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentGiven } = req.body;

    const appointment = await Appointment.findOne({
      _id: appointmentGiven._id,
    });

    const patientUsername = appointment.patient;
    const patient = await Patient.findOne({ username: patientUsername });

    const doctorUsername = appointment.doctor;
    const doctor = await Doctor.findOne({ username: doctorUsername });

    const combinedDateTime = new Date(appointment.datetime);

    const currentDate = new Date();
    const timeDifference = combinedDateTime - currentDate;

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    let i = 0;
    for (i; i < doctor.availableSlots.length; i++) {
      if (
        doctor.availableSlots[i].datetime.getTime() ===
        combinedDateTime.getTime()
      ) {
        doctor.availableSlots[i].reservingPatientUsername = null;
      }
    }

    appointment.status = "Cancelled";
    if (timeDifference > 24 * 60 * 60 * 1000) {
      patient.wallet += appointment.price;
    }

    await doctor.save();
    await appointment.save();
    await patient.save();

    // Create a new notification
    const appointmentNotification = new Notification({
      recipients: [doctorUsername, patient.username],
      content: `Appointment for ${patient.username} with Dr. ${doctor.username} that was scheduled on ${combinedDateTime} has been cancelled.`,
    });

    // Save the notification in the database
    await appointmentNotification.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Email content for the patient
    const patientEmailOptions = {
      from: "Rebooters",
      to: patient.email,
      subject: "Appointment Cancellation",
      text: `Dear ${patient.username},\n\nYour appointment with Dr. ${doctorUsername} that was scheduled on ${combinedDateTime} has been cancelled.\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Email content for the doctor
    const doctorEmailOptions = {
      from: "Rebooters",
      to: doctor.email,
      subject: "Cancelled Appointment",
      text: `Dear Dr. ${doctorUsername},\n\n Your appointment with ${patient.username} on ${combinedDateTime} has been cancelled.\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Send emails
    await transporter.sendMail(patientEmailOptions);
    await transporter.sendMail(doctorEmailOptions);

    res.status(200).json({ message: "Appointment cancelled" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while cancelling the appointment." });
  }
};

const startNewChatWithDoctor = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { messageContent, selectedDoctor } = req.body;

    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if there is an open chat between the patient and selected doctor
    const existingChat = await Chat.findOne({
      patient: patientUsername,
      doctor: selectedDoctor,
      closed: false,
    });

    if (existingChat) {
      // If an open chat exists, continue the chat
      existingChat.messages.push({
        username: patientUsername,
        userType: "patient",
        content: messageContent,
      });

      const updatedChat = await existingChat.save();
      console.log("Continuing existing chat:", updatedChat);

      return res.status(200).json({ chat: updatedChat });
    }

    // If no open chat exists, start a new one
    const newChat = new Chat({
      patient: patientUsername,
      doctor: selectedDoctor,
      messages: [
        {
          username: patientUsername,
          userType: "patient",
          content: messageContent,
        },
      ],
    });

    const savedChat = await newChat.save();

    console.log("New chat created:", savedChat);

    res.status(201).json({ chat: savedChat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error starting a new chat" });
  }
};

const continueChatWithDoctor = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { chatId, messageContent } = req.body;

    // Fetch the chat from the database
    const chat = await Chat.findById(chatId);

    if (!chat) {
      console.error("Chat not found");
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the patient is the owner of the chat
    if (chat.patient !== patientUsername) {
      console.error("Unauthorized to continue this chat");
      return res
        .status(403)
        .json({ message: "Unauthorized to continue this chat" });
    }

    // Add the patient's message to the messages array in the chat
    chat.messages.push({
      username: patientUsername,
      userType: "patient",
      content: messageContent,
    });

    // Save the updated chat to the database
    const updatedChat = await chat.save();

    // Respond with the updated chat
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error continuing the chat:", error);
    res.status(500).json({ message: "Error continuing the chat" });
  }
};

const viewMyChats = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;

    // Find all chats where the patient is the same as the logged-in patient's username
    /*const chats = await Chat.find({
      $and: [
        {
          $or: [
            { pharmacist: '' },
            { pharmacist: pharmacistUsername },
          ],
        },
        { patient: "" }, 
      ],
    });*/
    const chats = await Chat.find({
      patient: patientUsername,
    });
    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chats found." });
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chats" });
  }
};

const deleteChatWithDoctor = async (req, res) => {
  try {
    const { chatId } = req.body;

    // Find the chat based on the provided chat ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Update the chat to mark it as closed
    chat.closed = true;
    await chat.save();

    res.status(200).json({ message: "Chat closed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error closing chat" });
  }
};

const viewLinkedDoctors = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    // Query the Appointment model to find all distinct doctors for the given patient
    const doctors = await Appointment.distinct("doctor", {
      patient: patientUsername,
    });

    res.status(200).json({ doctors: doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error finding doctors" });
  }
};

const createZoomMeetingNotification = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const { doctorUsername } = req.body;

    const patient = await Patient.findOne({ username: patientUsername });
    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor || !patient) {
      return res.status(404).json({ error: "Doctor or patient not found." });
    }

    // Zoom URL scheme for starting a new meeting in the Zoom web app
    const zoomMeetingLink = `https://zoom.us/start?confno=`;

    // Create a new notification
    const zoomMeetingNotification = new Notification({
      recipients: [doctorUsername, patientUsername],
      content: `New Zoom meeting scheduled with ${patientUsername}. Click <a href="${zoomMeetingLink}" target="_blank">here</a> to create the meeting.`,
    });

    // Save the notification in the database
    await zoomMeetingNotification.save();

    res
      .status(200)
      .json({ message: "Zoom meeting notification created successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error:
          "An error occurred while creating the Zoom meeting notification.",
      });
  }
};

const viewMedicines = async (req, res) => {
  try {
    const patientName = req.cookies.username;
    const medicines = await medicineModel.find({});
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching medicines." });
  }
};
const payWithWallet = async (req, res) => {
  try {
    const patientUsername = req.cookies.username; // Assuming you store the patient's username in cookies
    const { value } = req.body;

    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }
    if (patient.wallet >= value) {
      patient.wallet -= value;
      await patient.save();
      return res
        .status(200)
        .json({ message: "Payment from wallet successful." });
    } else {
      return res.status(400).json({ error: "insufficient" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment." });
  }
};

const viewProfile = async (req, res) => {
  try {
    const patientUsername = req.cookies.username; // Assuming you store the patient's username in cookies

    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment." });
  }
};



const getPatientNotifications = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;

    // Fetch notifications where the patient username is in the recipients list
    const notifications = await Notification.find({
      recipients: { $in: [patientUsername] },
    });

    // Filter notifications based on recipients and visibility
    
    const filteredNotifications = notifications.filter(notification =>
      notification.recipients.some((recipient, index) =>
        recipient === patientUsername && notification.visibility[index] === "show"
      )
    );

    let count = 0;
    if(filteredNotifications && filteredNotifications.length>0){
        count = filteredNotifications.length;
    }

    res.status(200).json({filteredNotifications, count});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching notifications." });
  }
};

const hideNotification = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const {notificationId} = req.body;

    // Update the visibility to 'hide' for the specified patient and notification
    const updatedNotification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipients: patientUsername,
      },
      { $set: { 'visibility.$': 'hide' } },
      { new: true }
    );

    if (!updatedNotification) {
      return res
        .status(404)
        .json({ error: 'Notification not found for the specified patient.' });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating notification visibility.' });
  }
};


module.exports = {
  payWithWallet,
  viewMedicines,
  requestFollowUp,
  rescheduleAppointment,
  viewMedicalHistory,
  deleteMedicalHistory,
  payForAppointment,
  unsubscribeToHealthPackage,
  payForHealthPackage,
  subscribeToHealthPackage,
  viewHealthPackageOptions,
  viewHealthPackage,
  createNotFoundPatient,
  viewRegisteredFamilyMembers,
  createPrescription,
  viewAllPrescriptions,
  addFamilyMember,
  viewDoctors,
  findDoctor,
  filterDoctor,
  filterAppointmentsByDate,
  filterAppointmentsByStatus,
  filterPrescriptions,
  selectDoctor,
  viewMyAppointments,
  viewWallet,
  filterByPastDate,
  filterByUpcomingDate,
  viewAvailableDoctorSlots,
  viewHealthRecords,
  makeAppointment,
  logout,
  changePassword,
  addMedicalHistory,
  viewFamilyMembersHealthPackages,
  viewFamilyAppointments,
  getAvailableDoctors,
  cancelAppointment,
  startNewChatWithDoctor,
  continueChatWithDoctor,
  viewMyChats,
  deleteChatWithDoctor,
  viewLinkedDoctors,
  createZoomMeetingNotification,
  getPatientNotifications,
  viewProfile,
  hideNotification
};
