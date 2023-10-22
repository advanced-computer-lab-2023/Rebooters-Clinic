const express = require('express');
const Patient = require('../Models/patientModel'); // Import the Patient model
const Doctor = require('../Models/doctorModel');
const Prescription = require('../Models/prescriptionModel');
const Appointment = require('../Models/appointmentModel');

//i put these here also instead of creating a model of familyMember
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FamilyMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nationalId: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  relation: {
    type: String,
    required: true,
    enum: ['Wife', 'Husband', 'Child'],
  },
});


/*const selectDoctorByName = async (req, res) => {
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
*/

const createPatient = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      dateOfBirth,  // Assuming dateOfBirth is sent as a string in "YYYY-MM-DD" format
      gender,
      mobile_number,
      emergency_contact
    } = req.body;

    // Parse the dateOfBirth string into a JavaScript Date object
    const parsedDateOfBirth = new Date(dateOfBirth);

    const newPatient = new Patient({
      username,
      name,
      email,
      password,
      dateOfBirth: parsedDateOfBirth,  // Use the parsed date
      gender,
      mobile_number,
      emergency_contact
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the patient.' });
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
    const { patientName, doctorName, medication, dosage, instructions, prescriptionDate, filled } = req.body;

    // Parse the prescriptionDate string into a JavaScript Date object
    const parsedPrescriptionDate = new Date(prescriptionDate);

    // Create a new prescription with the "filled" status
    const prescription = new Prescription({ patientName, doctorName, medication, dosage, instructions, date: parsedPrescriptionDate, filled });

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

    // Convert the patientName to lowercase
    const lowercasePatientName = patientName.toLowerCase();

    // Find all prescriptions for the specified patient (case-insensitive)
    const prescriptions = await Prescription.find({ patientName: { $regex: new RegExp(lowercasePatientName, 'i') } });

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
    const patientUsername = req.body.username;
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

  const name = req.body.name;
  const nationalId = req.body.nationalId;
  const age = req.body.age;
  const gender = req.body.gender;
  const relation = req.body.relation;  
  

  // Create a new FamilyMember object
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

const viewRegisteredFamilyMembers = async (req, res) => {
  try {
    const patientUsername = req.body.username;
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const familyMembers = patient.familyMembers;
    res.status(200).json(familyMembers);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching registered family members' });
  }
};

const filterAppointmentsByDate = async (req, res) => {
  try {
    const { patientUsername, startDate, endDate } = req.body;

    // Find the patient by name
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Find all appointments for the patient between the specified dates
    const appointments = await Appointment.find({
      patient: patientUsername,
      datetime: {
        $gte: new Date(startDate).setHours(0, 0, 0, 0), // Greater than or equal to the start date
        $lte: new Date(endDate).setHours(23, 59, 59, 999),   // Less than or equal to the end date
      },
    });

    if (appointments.length === 0) {
      return res.json({ message: 'No appointments found between the specified dates.' });
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while filtering appointments by date.' });
  }
};





const filterAppointmentsByStatus = async (req, res) => {
  try {
    const { patientUsername, appointmentStatus } = req.body;

    // Find the patient by name
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Find all appointments for the patient with the specified status
    const appointments = await Appointment.find({
      patient: patientUsername,
      $expr: { $eq: [{ $toLower: '$status' }, appointmentStatus.toLowerCase()] },
    });

    if (appointments.length === 0) {
      return res.json({ message: 'No appointments found with the specified status.' });
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while filtering appointments by status.' });
  }
};


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
        sessionPrice = (doctor.hourlyRate + doctor.hourlyRate * 0.1) - (patient.healthPackage.discountOnSession);
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
      query.speciality = { $regex: new RegExp(speciality, 'i') }; // 'i' flag makes it case-insensitive
    }

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }; // 'i' flag makes it case-insensitive
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
    const { speciality, date } = req.body; // Get speciality, date, and time from the request body

    if (!speciality && !date ) {
      return res.status(400).json({ error: 'Please provide at least one search parameter (speciality, date, or time).' });
    }

    if (speciality && !date) {
      filteredDoctors = await Doctor.find({ speciality: { $regex: new RegExp(speciality, 'i') } });
      return res.status(200).json(filteredDoctors);
    }
    else if (!speciality && date) {
      const combinedDateTime = new Date(`${date}` + ":00.000+00:00");
      const appointments = await Appointment.find({ datetime: combinedDateTime });
      const doctorsWithAppointments = appointments.map((appointment) => appointment.doctor);
      filteredDoctors = await Doctor.find({ username: { $nin: doctorsWithAppointments } });
      return res.status(200).json(filteredDoctors)
    }

    else if (speciality && date) {
      const combinedDateTime = new Date(`${date}` + ":00.000+00:00");
      const appointments = await Appointment.find({ datetime: combinedDateTime });
      const doctorsWithAppointments = appointments.map((appointment) => appointment.doctor);
      filteredDoctors = await Doctor.find({
        speciality: { $regex: new RegExp(speciality, 'i') },
        username: { $nin: doctorsWithAppointments },
      });
      return res.status(200).json(filteredDoctors);
    }
    else {
      return res.status(400).json({ error: 'Please provide at least one search parameter (speciality or date).' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while filtering doctors.' });
  }
};






const filterPrescriptions = async (req, res) => {
  try {
    const { date, doctorName, filled } = req.body; // Get date, doctorName, and filled status from the request body

    // Check if at least one filter parameter is provided
    if (!date && !doctorName && filled === undefined) {
      return res.status(400).json({ error: 'At least one filter parameter (date, doctorName, filled) is required.' });
    }

    // Create an empty query object
    const query = {};

    if (date) {
      // Parse the date string into a JavaScript Date object
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format.' });
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
      query.doctorName = { $regex: new RegExp(`^${doctorName}$`, 'i') };
    }

    if (filled !== undefined) {
      // Add filled criteria to the query
      query.filled = filled;
    }

    // Use the query to filter prescriptions
    const filteredPrescriptions = await Prescription.find(query);

    if (filteredPrescriptions.length === 0) {
      return res.status(404).json({ message: 'No matching prescriptions found.' });
    }

    // Return the list of matching prescriptions
    res.status(200).json(filteredPrescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while filtering prescriptions.' });
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
      return res.status(404).json({ message: 'No doctors to select from.' });
    }

    // You can implement your selection logic here based on your criteria
    // For example, if you want to select the doctor with the most available slots:
    const selectedDoctor = combinedDoctors.reduce((prevDoctor, currentDoctor) => {
      if (currentDoctor.availableSlots.length > prevDoctor.availableSlots.length) {
        return currentDoctor;
      }
      return prevDoctor;
    });

    // Return the selected doctor
    res.status(200).json(selectedDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while selecting a doctor.' });
  }
};

const viewMyAppointments = async (req, res) => {
  try {
    const { patientUsername} = req.body;
    const myAppointments = await Appointment.find({ patient: patientUsername });
    res.status(200).json(myAppointments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};

const viewWallet = async (req, res) => {
  try {
    const { patientUsername } = req.body;
    const patient = await Patient.findOne({ username : patientUsername });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    const wallet = patient.wallet;
    res.status(200).json({ wallet });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the wallet' });
  }
};

const filterByPastDate = async (req, res) => {
  try {
    const { patientUsername } = req.body;
    const currentDateTime = new Date();
    const pastAppointments = await Appointment.find({ patient: patientUsername });

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
    res.status(500).json({ error: 'An error occurred while filtering past appointments' });
  }
};

const filterByUpcomingDate = async (req, res) => {
  try {
    const {patientUsername} = req.body;
    const currentDateTime = new Date();
    const upcomingAppointments = await Appointment.find({ patient: patientUsername });
    const filteredAppointments = upcomingAppointments.filter(appointment => {
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
    res.status(500).json({ error: 'An error occurred while filtering patients' });
  }
};

const viewHealthRecords = async (req, res) => {
  try {
    const { patientUsername } = req.body;
    const patient = await Patient.findOne({ username: patientUsername });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    const healthRecords = patient.healthRecords; 
    if (!healthRecords || healthRecords.length === 0) {
      res.status(404).json({ error: 'No health records found for the patient' });
      return;
    }
    res.status(200).json({ healthRecords });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching health records' });
  }
};


module.exports = {
  createPatient, viewRegisteredFamilyMembers,createPrescription,viewAllPrescriptions, addFamilyMember, viewDoctors, findDoctor, filterDoctor, filterAppointmentsByDate, filterAppointmentsByStatus,
filterPrescriptions,selectDoctor, viewMyAppointments , viewWallet , filterByPastDate , filterByUpcomingDate , viewHealthRecords
};
