const express = require('express');
const router = express.Router();
const Patient = require('../Models/Patient'); // Import the Patient model
const Doctor = require('../Models/Doctor');
const Prescription = require('../Models/Prescription');
const Appointment = require('../Models/Appointment.js');

const createPatient = async (req, res) => {
  try {
    const {username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact} = req.body; 
    const newPatient = new Patient({username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact});
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the patient.' });
  }
};

const selectDoctorByName = async (req, res) => {
  try {
    const { patientName, doctorName } = req.body;

    // Find the patient record by name
    const patient = await Patient.findOne({ name: patientName }); // Assuming 'name' is the field that stores the patient's name in the Patient model

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Ensure that the 'selectedDoctors' array exists in the patient object
    if (!patient.selectedDoctors) {
      patient.selectedDoctors = [];
    }

    // Check if the doctor name is already in the 'selectedDoctors' array
    let doctorExists = false;

    for (let i = 0; i < patient.selectedDoctors.length; i++) {
      const selectedDoctor = patient.selectedDoctors[i];
      if (selectedDoctor === doctorName) {
        doctorExists = true;
        break; // Exit the loop once a match is found
      }
    }

    if (!doctorExists) {
      // Add the selected doctor name to the patient's 'selectedDoctors' array
      patient.selectedDoctors.push(doctorName);

      // Save the patient's updated data
      await patient.save();

      res.json({ message: 'Doctor selected successfully.' });
    } else {
      return res.status(400).json({ error: 'Doctor is already selected.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while selecting the doctor.' });
  }
};


const ViewselectDoctorDetails = async (req, res) => {
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
};

const createPrescription = async (req, res) => {
  try {
    const { patientName, doctorName, medication, dosage, instructions } = req.body;
    const date = new Date();

    // Create a new prescription
    const prescription = new Prescription({ patientName, doctorName, medication, dosage, instructions, date });

    // Save the prescription to the database
    await prescription.save();

    res.status(201).json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the prescription.' });
  }
};

const viewAllPrescriptions = async (req, res) => {
  try {
    const { patientName } = req.body;

    // Find all prescriptions for the specified patient
    const prescriptions = await Prescription.find({ patientName });

    if (prescriptions.length === 0) {
      return res.json({ message: 'No prescriptions found for the patient.' });
    }

    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching prescriptions.' });
  }
};
const addFamilyMember = async (req, res) => {
  try {
    // Extract relevant data from the request body
    const { patientNationalId, name, nationalId, age, gender, relation } = req.body;

    // Find the patient by their national ID
    const patient = await Patient.findOne({ national_id: patientNationalId });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Create a new family member object
    const familyMember = {
      name,
      nationalId,
      age,
      gender,
      relation,
    };
    // Add the family member to the patient's familyMembers array
    patient.familyMembers.push(familyMember);

    // Save the updated patient document
    const updatedPatient = await patient.save();

    res.status(201).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add family member' });
  }
};

// const filterAppointmentsByDate = async (req, res) => {
//   try {
//     const patientUsername = req.body.username;
//     const currentDateTime = new Date();
//     const upcomingAppointments = await Appointment.find({ patient: patientUsername });
//     const filteredAppointments = upcomingAppointments.filter(appointment => {
//       const appointmentDateTime = new Date(appointment.datetime);
//       return appointmentDateTime >= currentDateTime;
//   });
//     res.status(200).json(filteredAppointments);
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while filtering patients' });
//   }
// };

// const filterAppointmentsByStatus = async (req, res) => {
//   try {
//     const patientUsername = req.body.username;
//     const { status } = req.body;
//     const upcomingAppointments = await Appointment.find({ patient: patientUsername });
//     const filteredAppointments = upcomingAppointments.filter(appointment => {
//       return appointment.status == status;
//   });
//     res.status(200).json(filteredAppointments);
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while filtering patients' });
//   }
// };

const viewDoctors = async (req, res) => {
  try {
    // Extract the patient's username from the request body
    const { patientUsername } = req.body;

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Retrieve all doctors from the database
    const doctors = await Doctor.find();

    // Calculate session prices for each doctor
    const doctorsWithSessionPrices = doctors.map((doctor) => {
      let sessionPrice = doctor.hourlyRate;

      if (patient.healthPackage) {
        // Apply the discount from the patient's health package
        sessionPrice = (doctor.hourlyRate + doctor.hourlyRate * 0.1) - (patient.healthPackage.discount);
      } else {
        // If no health package, calculate session price with clinic's markup only
        sessionPrice = doctor.hourlyRate + doctor.hourlyRate * 0.1;
      }

      return {
        _id: doctor._id,
        name: doctor.name,
        speciality: doctor.speciality,
        sessionPrice,
      };
    });

    res.status(200).json(doctorsWithSessionPrices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Define a function for patient to search for a doctor
const findDoctor = async (req, res) => {
  try {
    const { speciality, name } = req.body;

    // Build a query based on provided parameters
    const query = {};

    if (speciality) {
      query.speciality = { $regex: new RegExp(speciality, 'i') };
    }

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }

    // Check if at least one search parameter is provided
    if (!speciality && !name) {
      return res.status(400).json({ error: 'Please provide at least one search parameter (speciality or name).' });
    }

    // Use the query to search for doctors
    const doctors = await Doctor.find(query);

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No matching doctors found.' });
    }

    // Return the list of matching doctors
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching for doctors.' });
  }
};

// Define a function to filter doctors by speciality and available slots
const filterDoctor = async (req, res) => {
  try {
    const { speciality, date, time } = req.body; // Get speciality, date, and time from the request body

    // Check if both time and date are required
    if (time && !date) {
      return res.status(400).json({ error: 'Date is required when specifying a time.' });
    }

    // Build a query based on provided parameters
    const query = {};

    if (speciality) {
      query.speciality = speciality;
    }

    if (date && time) {
      query.availableSlots = {
        $elemMatch: {
          date: new Date(date),
          time,
        },
      };
    }

    // Use the query to filter doctors
    const filteredDoctors = await Doctor.find(query);

    if (filteredDoctors.length === 0) {
      return res.status(404).json({ message: 'No matching doctors found.' });
    }

    // Return the list of matching doctors
    res.status(200).json(filteredDoctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while filtering doctors.' });
  }
};


module.exports = {
  createPatient, selectDoctorByName,ViewselectDoctorDetails,createPrescription,viewAllPrescriptions, addFamilyMember, viewDoctors, findDoctor, filterDoctor
};
