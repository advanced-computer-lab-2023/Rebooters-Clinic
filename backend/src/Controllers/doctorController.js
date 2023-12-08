const Doctor = require("../Models/doctorModel");
const Patient = require("../Models/patientModel");
const Appointment = require("../Models/appointmentModel");
const Prescription = require("../Models/prescriptionModel");
const Contract = require("../Models/contractModel");
const Notification = require("../Models/notificationModel");
const DoctorRequest = require("../Models/newDoctorRequestModel");
const bcrypt = require("bcrypt"); //needed only for creating the dummy doctor password
const { logout, changePassword } = require("./authController");
const Chat = require('../Models/chatModel');
const PatientController = require("../Controllers/patientController");
const nodemailer = require('nodemailer');

const { default: mongoose } = require("mongoose");

// //dummy doctor but with the password encryption:
// // Generate a random password
// const randomPassword = 'randompassword123'; // Replace with your random password generation logic

// // Hash the password
// bcrypt.hash(randomPassword, 10, async (err, hashedPassword) => {
//     if (err) {
//         console.error('Error hashing the password:', err);
//         return;
//     }

//     try {
//         // Create a new pharmacist document with the hashed password
//         const newDoctor = new Doctor({
//             username: 'dumDOC',
//             name: 'Dummy doctor Name',
//             email: 'shahd@gmail.com',
//             password: hashedPassword,
//             dateOfBirth: new Date('1990-01-01'),
//             hourlyRate: 25, // Replace with the desired rate
//             affiliation: 'Dummy Affiliation',
//             educationalBackground: 'PharmD',
//         });

//         // Save the new pharmacist to the database
//         await newDoctor.save();

//         console.log('Dummy doc created successfully.');
//     } catch (error) {
//         console.error('Error creating the dummy doc:', error);
//     }
// });

// const dummyPatient = new Patient({
//   username: 'dummypatient2',
//   national_id: '123123123123',
//   name: 'Dummy Patient',
//   email: 'dummypatient@example.com',
//   password: 'dummypatientpassword',
//   dateOfBirth: new Date('1995-03-15'),
//   gender: 'Female',
//   mobile_number: '123-456-7890',
//   emergency_contact: '987-654-3210',
// });

// dummyPatient.save();

// const dummyAppointment = new Appointment({
//   doctor: 'dummydoctor',
//   patient: 'dummypatient',
//   datetime: new Date('2024-10-25T14:00:00'),
//   status: 'Scheduled',
//   price: 150.0,
// });

// dummyAppointment.save();

// Create a new Contract instance
// const newContract = new Contract({
//   doctorName: 'John Doe',
//   employerName: 'Medical Group ABC',
//   startDate: new Date('2023-01-15'),
//   endDate: new Date('2023-12-31'),
//   salary: 120000, // Salary in your desired currency
//   accepted: false,
// });

// Save the new contract to the database
// newContract.save();

// const sampleContract = new Contract({
//   doctorName: 'dumDOC',
//   employerName: 'Healthcare Inc.',
//   startDate: new Date('2023-11-01'),
//   endDate: new Date('2024-11-01'),
//   salary: 120000,
// });

// sampleContract.save();

const viewProfile = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const doctor = await Doctor.findOne({ username: doctorUsername });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching profile data" });
  }
};

const updateProfile = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const { email, hourlyRate, affiliation } = req.body;
    await Doctor.findOneAndUpdate(
      { username: doctorUsername },
      {
        email,
        hourlyRate,
        affiliation,
      }
    );
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile" });
  }
};

const viewMyPatients = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const appointments = await Appointment.find({ doctor: doctorUsername });
    const patientUsernames = appointments.map(
      (appointment) => appointment.patient
    );
    const patients = await Patient.find({
      username: { $in: patientUsernames },
    });
    res.status(200).json(patients);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching patients" });
  }
};

const viewAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching patients" });
  }
};

const searchPatientByName = async (req, res) => {
  try {
    const { name } = req.body;
    const patient = await Patient.find({
      name: { $regex: new RegExp(name, "i") },
    }); //this is case insensitive
    res.status(200).json(patient);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for patients" });
  }
};

const searchPatientByUsername = async (req, res) => {
  try {
    const { patientUsername } = req.body;
    const patient = await Patient.find({ username: patientUsername });
    if (!patient) {
      return res
        .status(404)
        .json({ error: "Patient not found or no prescriptions found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for patients" });
  }
};

const searchPatientPrescriptionsByName = async (req, res) => {
  try {
    const { patientName } = req.body;
    const prescriptions = await Prescription.find({ patientName: patientName });
    if (!prescriptions) {
      return res
        .status(404)
        .json({ error: "Patient not found or no prescriptions found" });
    }
    res.status(200).json(prescriptions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for patients" });
  }
};

const viewMyAppointments = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const currentDateTime = new Date();
    const upcomingAppointments = await Appointment.find({
      doctor: doctorUsername,
    });
    res.status(200).json(upcomingAppointments);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const filterByUpcomingDate = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const currentDateTime = new Date();
    const upcomingAppointments = await Appointment.find({
      doctor: doctorUsername,
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

const filterByStatus = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const { status } = req.body;
    const upcomingAppointments = await Appointment.find({
      doctor: doctorUsername,
    });
    const filteredAppointments = upcomingAppointments.filter((appointment) => {
      return appointment.status.toLowerCase() === status.toLowerCase();
    });
    res.status(200).json(filteredAppointments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering patients" });
  }
};

const selectPatient = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const { patientUsernames } = req.body;
    const doctor = await Doctor.findOne({ doctorUsername });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    doctor.selectedPatients.push(...patientUsernames);
    await doctor.save();
    res.status(200).json({ message: "Patients selected successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while selecting patients" });
  }
};

const filterByDateRange = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { startDate, endDate } = req.body;
    const doctor = await Doctor.findOne({ doctorUsername });
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    startDateTime.setHours(0, 0, 0, 0);
    endDateTime.setHours(23, 59, 59, 999);
    if (startDateTime > endDateTime) {
      return res.status(400).json({ error: "Invalid date range" });
    }
    const appointmentsInRange = await Appointment.find({
      doctor: doctorUsername,
      datetime: {
        $gte: startDateTime,
        $lte: endDateTime,
      },
    });

    appointmentsInRange.sort((a, b) => {
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      return dateA - dateB;
    });

    res.status(200).json(appointmentsInRange);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering appointments" });
  }
};
const viewAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching doctors" });
  }
};

const viewWallet = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const doctor = await Doctor.findOne({ username: doctorUsername });
    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }
    const wallet = doctor.wallet;
    res.status(200).json({ wallet });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the wallet" });
  }
};

const filterByPastDate = async (req, res) => {
  try {
    //const { doctorUsername } = req.body;
    const doctorUsername = req.cookies.username;
    const currentDateTime = new Date();
    const pastAppointments = await Appointment.find({ doctor: doctorUsername });

    const filteredAppointments = pastAppointments.filter((appointment) => {
      const appointmentDateTime = new Date(appointment.datetime);
      return appointmentDateTime < currentDateTime; // Filter past appointments
    });

    filteredAppointments.sort((a, b) => {
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      return dateB - dateA; // Sort in descending order (most recent past appointments first)
    });

    res.status(200).json(filteredAppointments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while filtering past appointments" });
  }
};

const viewHealthRecords = async (req, res) => {
  try {
    const { patientUsername } = req.body;
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

//  16.1:
const viewContract = async (req, res) => {
  try {
    //const { doctorUsername } = req.body;
    const doctorUsername = req.cookies.username;

    // Find the contract for the doctor
    const contract = await Contract.find({ doctorName: doctorUsername });

    if (!contract) {
      return res.status(404).json({ error: "Contract not found." });
    }

    res.status(200).json({ contract });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while accepting the contract." });
  }
};

//  16.2:
const acceptContract = async (req, res) => {
  try {
    const { contractID } = req.body;
    const doctorUsername = req.cookies.username;
    const doctor = await Doctor.findOne({ username: doctorUsername });
    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }

    // Find the contract for the doctor
    const contract = await Contract.findOne({ _id: contractID });

    if (!contract) {
      return res.status(404).json({ error: "Contract not found." });
    }

    // Check if the contract is already accepted
    if (contract.status === "accepted") {
      return res.status(400).json({ error: "Contract is already accepted." });
    }

    // Update the contract status to 'accepted'
    contract.status = "accepted";
    await contract.save();

    doctor.acceptedContract = true;
    await doctor.save();

    res.status(200).json({ message: "Contract accepted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while accepting the contract." });
  }
};

//  16.2.1:
const rejectContract = async (req, res) => {
  try {
    const { contractID } = req.body;

    const doctorUsername = req.cookies.username;

    // Find the contract for the doctor
    const contract = await Contract.findOne({ _id: contractID });

    if (!contract) {
      return res.status(404).json({ error: "Contract not found." });
    }

    // Check if the contract is already accepted
    if (contract.status === "accepted") {
      return res.status(400).json({ error: "Contract is already accepted." });
    }

    // Update the contract status to 'rejected'
    contract.status = "rejected";
    await contract.save();

    res.status(200).json({ message: "Contract rejected successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while rejecting the contract." });
  }
};

// 17: Function to add available time slots for appointments
const addAvailableSlots = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { datetime } = req.body;

    const doctor = await Doctor.findOne({ username: doctorUsername });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    // Ensure the provided date and time are ahead of the current date and time
    const currentDateTime = new Date();
    const providedDateTime = new Date(`${datetime}`);

    if (providedDateTime <= currentDateTime) {
      return res.status(400).json({
        error:
          "Please provide a date and time ahead of the current date and time.",
      });
    }

    // Append the new available time slots to the doctor's existing slots
    const newSlot = { datetime };
    doctor.availableSlots.push(newSlot);

    // Save the updated doctor document
    await doctor.save();

    res
      .status(200)
      .json({ message: "Available time slots added successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding available time slots." });
  }
};

//  51:
const scheduleAppointment = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { patientUsername, dateTime } = req.body;

    const doctor = await Doctor.findOne({ username: doctorUsername });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    //make sure patient is one of doctor's patients
    const appointments = await Appointment.find({ doctor: doctorUsername });
    const patientUsernames = appointments.map(
      (appointment) => appointment.patient
    );

    if (!patientUsernames.includes(patientUsername)) {
      return res
        .status(404)
        .json({ error: "Patient is not one of the doctor's patients" });
    }

    // Ensure the provided date and time are ahead of the current date and time
    const currentDateTime = new Date();
    const providedDateTime = new Date(`${dateTime}`);

    if (providedDateTime <= currentDateTime) {
      return res.status(400).json({
        error:
          "Please provide a date and time ahead of the current date and time.",
      });
    }

    // Create a new appointment for the follow-up or regular appointment
    appointmentPrice = doctor.hourlyRate;
    if (patient.statusOfHealthPackage === "Subscribed") {
      appointmentPrice =
        doctor.hourlyRate * patient.healthPackage.discountOnSession;
    }
    const appointment = new Appointment({
      doctor: doctorUsername,
      patient: patientUsername,
      datetime: new Date(dateTime),
      status: "Upcoming",
      price: appointmentPrice,
    });

    // Save the appointment to the database
    await appointment.save();

    const prescription = new Prescription({
      patientName: patientUsername,
      doctorUsername: doctorUsername,
      doctorName : doctor.name,
      date: new Date(dateTime),
    });
    await prescription.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while scheduling the appointment." });
  }
};

//  60:
const addHealthRecord = async (req, res) => {
  try {
    // attachements ba3den ?
    const doctorUsername = req.cookies.username;
    const { patientUsername, diagnosis, treatment, notes, medication, dosage } =
      req.body;

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const appointments = await Appointment.find({ doctor: doctorUsername });
    const patientUsernames = appointments.map(
      (appointment) => appointment.patient
    );

    if (!patientUsernames.includes(patientUsername)) {
      return res
        .status(404)
        .json({ error: "Patient is not one of the doctor's patients" });
    }

    // Create a new health record
    const healthRecord = {
      doctor: doctorUsername,
      date: new Date(),
      diagnosis,
      treatment,
      notes,
    };

    // Add the health record to the patient's healthRecords array
    patient.healthRecords.push(healthRecord);

    // Save the updated patient document
    await patient.save();

    /*const prescription = new Prescription({
      patientName: patientUsername,
      doctorUsername: doctorUsername,
      doctorName: doctor.name,
      date: new Date(),
      medication: medication,
      dosage: dosage,
      instructions: treatment,
      filled: true,
    });
    await prescription.save();*/

    res.status(201).json({ message: "Health record added successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding a health record." });
  }
};

const addPrescription = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { patientUsername, medicationInfo } = req.body;

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const appointments = await Appointment.find({ doctor: doctorUsername });
    const patientUsernames = appointments.map(
      (appointment) => appointment.patient
    );

    if (!patientUsernames.includes(patientUsername)) {
      return res
        .status(404)
        .json({ error: "Patient is not one of the doctor's patients" });
    }

    const prescription = new Prescription({
      patientName: patientUsername,
      doctorUsername: doctorUsername,
      doctorName: doctor.name,
      date: new Date(),
      medicationInfo: medicationInfo,
      filled: true,
    });
    await prescription.save();

    res
      .status(201)
      .json({ message: "Patient Prescription added successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding Prescription." });
  }
};

const removeFromPrescription = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { patientUsername, prescriptionID, medicineIndex } = req.body;

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const appointments = await Appointment.find({ doctor: doctorUsername });
    const patientUsernames = appointments.map(
      (appointment) => appointment.patient
    );

    if (!patientUsernames.includes(patientUsername)) {
      return res
        .status(404)
        .json({ error: "Patient is not one of the doctor's patients" });
    }

    const prescription = await Prescription.findOne({ _id: prescriptionID });
    prescription.medicationInfo.splice(medicineIndex, 1);
    await prescription.save();
    const updatedPrescription = await Prescription.findOne({
      _id: prescriptionID,
    });
    res.status(201).json({
      message: "Medicine removed from prescription successfully.",
      prescription: updatedPrescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while removing medicine from Prescription.",
    });
  }
};

const addToPrescription = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { patientUsername, prescriptionID, medicine } = req.body;

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const appointments = await Appointment.find({ doctor: doctorUsername });
    const patientUsernames = appointments.map(
      (appointment) => appointment.patient
    );

    if (!patientUsernames.includes(patientUsername)) {
      return res
        .status(404)
        .json({ error: "Patient is not one of the doctor's patients" });
    }

    const prescription = await Prescription.findOne({ _id: prescriptionID });
    prescription.medicationInfo.push({
      medicine: medicine.medicine,
      dosage: medicine.dosage,
      instructions: medicine.instructions,
    });
    await prescription.save();
    const updatedPrescription = await Prescription.findOne({
      _id: prescriptionID,
    });
    res.status(201).json({
      message: "Medicine added to prescription successfully.",
      prescription: updatedPrescription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while adding medicine To Prescription.",
    });
  }
};

const editPrescription = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const {
      patientUsername,
      prescriptionID,
      medicineIndex,
      dosage,
      instructions,
    } = req.body;

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const appointments = await Appointment.find({ doctor: doctorUsername });
    const patientUsernames = appointments.map(
      (appointment) => appointment.patient
    );

    if (!patientUsernames.includes(patientUsername)) {
      return res
        .status(404)
        .json({ error: "Patient is not one of the doctor's patients" });
    }

    const prescription = await Prescription.findOne({ _id: prescriptionID });
    if (
      medicineIndex >= 0 &&
      medicineIndex < prescription.medicationInfo.length
    ) {
      if (dosage !== undefined && dosage !== "") {
        prescription.medicationInfo[medicineIndex].dosage = dosage;
      }

      if (instructions !== undefined && instructions !== "") {
        prescription.medicationInfo[medicineIndex].instructions = instructions;
      }

      await prescription.save();
      const updatedPrescription = await Prescription.findOne({
        _id: prescriptionID,
      });
      res.status(201).json({
        message: "Prescription updated successfully.",
        prescription: updatedPrescription,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating Prescription." });
  }
};
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentGiven } = req.body;

    

    const appointment = await Appointment.findOne({
      _id : appointmentGiven._id
    })

    const patientUsername = appointment.patient;
    const patient = await Patient.findOne({username : patientUsername })

    const doctorUsername = appointment.doctor;
    const doctor = await Doctor.findOne({username : doctorUsername })

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

    let i=0
    for(i;i<doctor.availableSlots.length;i++){
      if(doctor.availableSlots[i].datetime.getTime() === combinedDateTime.getTime()){
        doctor.availableSlots[i].reservingPatientUsername = null
      }
    }

    appointment.status = 'Cancelled';
    if(timeDifference > 24 * 60 * 60 * 1000){
      patient.wallet += appointment.price;}


    await doctor.save();
    await appointment.save(); 
    await patient.save();

    // Create a new notification
    const appointmentNotification = new Notification({
      recipients: [doctor.username, patient.username],
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
      subject: 'Appointment Cancellation',
      text: `Dear ${patient.username},\n\nYour appointment with Dr. ${doctorUsername} that was scheduled on ${combinedDateTime} has been cancelled.\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Email content for the doctor
    const doctorEmailOptions = {
      from: "Rebooters",
      to: doctor.email,
      subject: 'Cancelled Appointment',
      text: `Dear Dr. ${doctorUsername},\n\n Your appointment with ${patient.username} on ${combinedDateTime} has been cancelled.\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Send emails
    await transporter.sendMail(patientEmailOptions);
    await transporter.sendMail(doctorEmailOptions);

    
    res
      .status(200)
      .json({ message: "Appointment cancelled" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while cancelling the appointment." });
  }
};


// Add a new API endpoint in the DoctorController
const sendMessageToPharmacist = async (req, res) => {

  try {
    const doctorUsername = req.cookies.username;
    const { chatId, messageContent } = req.body;

    // Find the chat based on the provided chat ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the doctor is assigned to the chat
    if (chat.doctor !== '' && chat.doctor !== doctorUsername) {
      return res.status(403).json({ message: 'There is another Doctor already assigned to this chat' });
    } 
    
    if (chat.doctor === '') {
      chat.doctor = doctorUsername;
    }

    // Add the doctor's message to the messages array in the chat
    chat.messages.push({
      username: doctorUsername,
      userType: 'doctor',
      content: messageContent,
    });

    // Save the updated chat to the database
    const updatedChat = await chat.save();

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message to the doctor' });
  }
};

const viewAllChats = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username; // Get the doctor's username from the cookies

    // Find all chats where the doctor is either an empty string or matches the doctor's username
    const chats = await Chat.find({
      $or: [
        { doctor: '' },
        { doctor: doctorUsername },
      ],
    });

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: 'No chats found.' });
    }

    // Check the status of each chat and update the doctor's ability to send messages
    const updatedChats = chats.map(chat => {
      const isClosed = chat.closed || false; // If 'closed' is not defined, default to false
      const canSendMessages = !isClosed; // If the chat is closed, the doctor can't send messages

      return {
        ...chat.toObject(), // Convert Mongoose document to plain JavaScript object
        canSendMessages,
      };
    });

    res.status(200).json(updatedChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

const startNewChat = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { messageContent } = req.body;

    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newChat = new Chat({
      doctor: doctorUsername,
      pharmacist: '',
      messages: [
        {
          username: doctorUsername,
          userType: 'doctor',
          content: messageContent,
        },
      ],
    });

    const savedChat = await newChat.save();
    // Update the patient's chats array with the new chat ID
    await doctor.save();

    res.status(201).json(savedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error starting a new chat' });
  }
};

const continueChat = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { chatId, messageContent } = req.body;

    // Fetch the chat from the database
    const chat = await Chat.findById(chatId);

    if (!chat) {
      console.error('Chat not found');
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the pharmacist is the owner of the chat
    if (chat.doctor !== doctorUsername) {
      console.error('Unauthorized to continue this chat');
      return res.status(403).json({ message: 'Unauthorized to continue this chat' });
    }

    // Add the pharmacist's message to the messages array in the chat
    chat.messages.push({
      username: doctorUsername,
      userType: 'doctor',
      content: messageContent,
    });

    // Save the updated chat to the database
    const updatedChat = await chat.save();

    // Notify the clinic about the new message
    const clinicApiUrl = 'http://localhost:8000'; // Replace with the actual backend URL
    const clinicEndpoint = '/api/sendMessageToDoctor';
    const clinicResponse = await fetch(`${clinicApiUrl}${clinicEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
        messageContent: messageContent,
        doctorUsername: doctorUsername,
      }),
    });

    if (!clinicResponse.ok) {
      console.error('Failed to send message to the pharmacy:', clinicResponse.status, clinicResponse.statusText);
      throw new Error('Failed to send message to the pharmacy');
    }

    // Respond with the updated chat
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error('Error continuing the chat:', error);
    res.status(500).json({ message: 'Error continuing the chat' });
  }
};


const viewMyChats = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;

    // Find all chats where the patient is the same as the logged-in patient's username
    const chats = await Chat.find({
      $and: [
        {
          $or: [
            { doctorUsername: '' },
            { doctor: doctorUsername },
          ],
        },
        { patient: "false" }, 
        { closed: false }, 
      ],
    });    
    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: 'No chats found.' });
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};


const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the chat based on the provided chat ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Update the chat to mark it as closed
    chat.closed = true;
    await chat.save();

    res.status(200).json({ message: 'Chat closed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error closing chat' });
  }
};

const acceptFollowUpRequest = async (req, res) => {
  try {
    const { datetime } = req.body;

    // Check if the follow-up request has been revoked
    const existingAppointment = await Appointment.findOne({ datetime });

    if (existingAppointment.FollowUpRequest.status === 'Revoked') {
      return res.status(400).json({ error: 'Cannot accept a revoked follow-up request.' });
    }

    // Update the status of the follow-up request to 'Accepted'
    await Appointment.updateOne(
      { datetime },
      { $set: { 'FollowUpRequest.status': 'Accepted' } }
    );

    // Fetch the details of the existing appointment
    const { patient, doctor, FollowUpRequest } = existingAppointment;
    const { reason, preferredDate } = FollowUpRequest;

    // Create a new appointment with the preferred date
    const newAppointment = new Appointment({
      doctor,
      patient,
      datetime: new Date(preferredDate),
      status: 'Upcoming',
      price: existingAppointment.price,
      payment: 'Unpaid',
    });

    // Save the new appointment to the database
    await newAppointment.save();

    res.json({ message: 'Follow-up request accepted successfully. New appointment created.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while accepting the follow-up request.' });
  }
};



const revokeFollowUpRequest = async (req, res) => {
  try {
    const { datetime } = req.body;

    // Check if the follow-up request has been accepted
    const existingAppointment = await Appointment.findOne({ datetime });

    if (existingAppointment.FollowUpRequest.status === 'Accepted') {
      return res.status(400).json({ error: 'Cannot revoke an already accepted follow-up request.' });
    }

    // Update the status of the follow-up request to 'Revoked'
    await Appointment.updateOne(
      { datetime },
      { $set: { 'FollowUpRequest.status': 'Revoked' } }
    );

    res.json({ message: 'Follow-up request revoked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while revoking the follow-up request.' });
  }
};


const rescheduleAppointment = async (req, res) => {
  try {
    const { datetime, newDatetime } = req.body;

    // Assuming you want to update the appointment's datetime
    const oldAppointment = await Appointment.findOne({datetime});
    oldAppointment.datetime = newDatetime;
    oldAppointment.status = "Rescheduled";


    const combinedDateTime = new Date(newDatetime);
    const appointment = await Appointment.findOne({datetime: newDatetime});
    const doctorUsername = appointment.doctor;
    const patientUsername = appointment.patient;

    const doctor = await Doctor.findOne({username: doctorUsername});
    const patient = await Patient.findOne({username: patientUsername});


    // Create a new notification
    const appointmentNotification = new Notification({
      recipients: [doctorUsername, patientUsername],
      content: `Appointment for ${patientUsername} with Dr. ${doctorUsername} has been rescheduled to ${combinedDateTime}`,
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
      subject: 'Appointment Reschedule',
      text: `Dear ${patient.username},\n\nYour appointment with Dr. ${doctorUsername} has been rescheduled to ${combinedDateTime} .\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Email content for the doctor
    const doctorEmailOptions = {
      from: "Rebooters",
      to: doctor.email,
      subject: 'Appointment Reschedule',
      text: `Dear Dr. ${doctorUsername},\n\n Your appointment with ${patient.username} has been rescheduled to ${combinedDateTime}.\n\nRegards,\nThe Rebooters Clinic`,
    };

    // Send emails
    await transporter.sendMail(patientEmailOptions);
    await transporter.sendMail(doctorEmailOptions);

    


    res.json({ message: 'Appointment rescheduled successfully.' });



  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rescheduling the appointment.' });
  }
};

const getDoctorFollowUpRequests = async (req, res) => {
  try {
    // Retrieve the doctor's username from the cookies
    const doctorUsername = req.cookies.username;

    // Retrieve all appointments where the doctor is the assigned doctor
    const followUpRequests = await Appointment.find({
      'doctor': doctorUsername,
      'FollowUpRequest.status': { $in: ['Pending', 'Accepted', 'Revoked'] } // Optional: Filter by status if needed
    });

    res.json({ followUpRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching follow-up requests.' });
  }
};



const viewMyChatsWithPatients = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;

    const chats = await Chat.find({
      'doctor': doctorUsername,
      'pharmacist' : "false"
    });    
    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: 'No chats found.' });
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

const startNewChatWithPatient = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { messageContent, selectedPatient } = req.body;

    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newChat = new Chat({
      patient: selectedPatient,
      doctor: doctorUsername,
      messages: [
        {
          username: doctorUsername,
          userType: 'doctor',
          content: messageContent,
        },
      ],
    });

    const savedChat = await newChat.save();


    res.status(201).json({ savedChat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error starting a new chat' });
  }
};


const continueChatWithPatient = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { chatId, messageContent } = req.body;

    // Fetch the chat from the database
    const chat = await Chat.findById(chatId);

    if (!chat) {
      console.error('Chat not found');
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the doctor is the owner of the chat
    if (chat.doctor !== doctorUsername) {
      console.error('Unauthorized to continue this chat');
      return res.status(403).json({ message: 'Unauthorized to continue this chat' });
    }

    // Add the doctor's message to the messages array in the chat
    chat.messages.push({
      username: doctorUsername,
      userType: 'doctor',
      content: messageContent,
    });

    // Save the updated chat to the database
    const updatedChat = await chat.save();

    // Respond with the updated chat
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error('Error continuing the chat:', error);
    res.status(500).json({ message: 'Error continuing the chat' });
  }
};

const deleteChatWithPatient = async (req, res) => {
  try {
    const { chatId } = req.body;

    // Find the chat based on the provided chat ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Update the chat to mark it as closed
    chat.closed = true;
    await chat.save();

    res.status(200).json({ message: 'Chat closed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error closing chat' });
  }
};

const viewLinkedPatients = async (req,res) =>{
    try {
      const  doctorUsername  = req.cookies.username;
      // Query the Appointment model to find all distinct doctors for the given patient
      const patients = await Appointment.distinct('patient', { 'doctor': doctorUsername });
  
      res.status(200).json({ patients: patients });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error finding patients' });
    }
  
  };
  

  const createZoomMeetingNotification = async (req, res) => {
    try {
      const doctorUsername = req.cookies.username;
      const { patientUsername} = req.body;
  
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
  
      
      res.status(200).json({ message: "Zoom meeting notification created successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while creating the Zoom meeting notification." });
    }
  };
  
  const getDoctorNotifications = async (req, res) => {
    try {
      const doctorUsername = req.cookies.username;
  
      // Fetch notifications where the doctor username is in the recipients list
      const notifications = await Notification.find({ recipients: { $in: [doctorUsername] } });
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching notifications.' });
    }
  };
 



module.exports = {
  cancelAppointment,
  viewProfile,
  updateProfile,
  viewMyPatients,
  viewAllPatients,
  searchPatientByName,
  filterByUpcomingDate,
  filterByStatus,
  selectPatient,
  viewMyAppointments,
  searchPatientByUsername,
  filterByDateRange,
  viewAllDoctors,
  searchPatientPrescriptionsByName,
  viewWallet,
  filterByPastDate,
  viewHealthRecords,
  viewContract,
  acceptContract,
  rejectContract,
  addAvailableSlots,
  scheduleAppointment,
  addHealthRecord,
  logout,
  changePassword,
  addPrescription,
  removeFromPrescription,
  addToPrescription,
  editPrescription,
  sendMessageToPharmacist,
  viewAllChats,startNewChat,continueChat,viewMyChats,deleteChat,
  acceptFollowUpRequest,
  revokeFollowUpRequest,
  rescheduleAppointment,
  getDoctorFollowUpRequests,
  viewMyChatsWithPatients, 
  startNewChatWithPatient,
  continueChatWithPatient,
  deleteChatWithPatient,
  viewLinkedPatients,
  createZoomMeetingNotification,
  getDoctorNotifications


};
