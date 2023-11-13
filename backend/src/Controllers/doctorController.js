const Doctor = require('../Models/doctorModel');
const Patient = require('../Models/patientModel');
const Appointment = require('../Models/appointmentModel'); 
const Prescription = require('../Models/prescriptionModel'); 
const Contract = require('../Models/contractModel');
const DoctorRequest = require('../Models/newDoctorRequestModel');
const bcrypt = require('bcrypt'); //needed only for creating the dummy doctor password
const {logout, changePassword } = require('./authController');

const { default: mongoose } = require('mongoose');

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
        const doctor = await Doctor.findOne({ username : doctorUsername });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
          }
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching profile data' });
    }
};
  
const updateProfile = async (req, res) => {
    try {
      //const {doctorUsername} = req.body;
      const doctorUsername = req.cookies.username;
      const { email, hourlyRate, affiliation } = req.body;
      await Doctor.findOneAndUpdate(
        { username: doctorUsername }, {
        email,
        hourlyRate,
        affiliation,
      });
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the profile' });
    }
};
  
const viewMyPatients = async (req, res) => {
    try {
      //const {doctorUsername} = req.body;
      const doctorUsername = req.cookies.username;
      const appointments  = await Appointment.find({ doctor: doctorUsername });
      const patientUsernames = appointments.map((appointment) => appointment.patient);
      const patients = await Patient.find({ username: { $in: patientUsernames } });
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching patients' });
    }
};

const viewAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching patients' });
    }
};
  
const searchPatientByName = async (req, res) => {
    try {
        const { name } = req.body;
        const patient = await Patient.find({name : { $regex: new RegExp(name, 'i') }}); //this is case insensitive
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching for patients' });
    }
};

const searchPatientByUsername = async (req, res) => {
  try {
      const { patientUsername } = req.body;
      const patient = await Patient.find({username : patientUsername}); 
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found or no prescriptions found' });
      }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for patients' });
  }
};

const searchPatientPrescriptionsByName = async (req, res) => {
  try {
      const { patientName } = req.body;
      const prescriptions = await Prescription.find({patientName : patientName}); 
      if (!prescriptions) {
        return res.status(404).json({ error: 'Patient not found or no prescriptions found' });
      }
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for patients' });
  }
};

const viewMyAppointments = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const currentDateTime = new Date();
    const upcomingAppointments = await Appointment.find({ doctor: doctorUsername });
    res.status(200).json(upcomingAppointments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};
  
const filterByUpcomingDate = async (req, res) => {
    try {
      //const {doctorUsername} = req.body;
      const doctorUsername = req.cookies.username;
      const currentDateTime = new Date();
      const upcomingAppointments = await Appointment.find({ doctor: doctorUsername });
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

const filterByStatus = async (req, res) => {
    try {
      //const {doctorUsername} = req.body;
      const doctorUsername = req.cookies.username;
      const { status } = req.body;
      const upcomingAppointments = await Appointment.find({ doctor: doctorUsername });
      const filteredAppointments = upcomingAppointments.filter(appointment => {
        return appointment.status.toLowerCase() === status.toLowerCase();
    });
      res.status(200).json(filteredAppointments);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while filtering patients' });
    }
};
  

const selectPatient = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const { patientUsernames } = req.body;
    const doctor = await Doctor.findOne({ doctorUsername });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    doctor.selectedPatients.push(...patientUsernames);
    await doctor.save();
    res.status(200).json({ message: 'Patients selected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while selecting patients' });
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
      return res.status(400).json({ error: 'Invalid date range' });
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
    res.status(500).json({ error: 'An error occurred while filtering appointments' });
  }
};
const viewAllDoctors = async (req, res) => {
  try {
      const doctors = await Doctor.find({});
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching doctors' });
  }
};

const viewWallet = async (req, res) => {
  try {
    //const {doctorUsername} = req.body;
    const doctorUsername = req.cookies.username;
    const doctor = await Doctor.findOne({ username : doctorUsername });
    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }
    const wallet = doctor.wallet;
    res.status(200).json({ wallet });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the wallet' });
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
    res.status(500).json({ error: 'An error occurred while filtering past appointments' });
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

//  16.1:
const viewContract = async (req, res) => {
  try {
    //const { doctorUsername } = req.body;
    const doctorUsername = req.cookies.username;

    // Find the contract for the doctor
    const contract = await Contract.find({ doctorName : doctorUsername });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    res.status(200).json({ contract });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while accepting the contract.' });
  }
};



//  16.2:
const acceptContract = async (req, res) => {
  try {
    const { contractID } = req.body;
    const doctorUsername = req.cookies.username;
    const doctor = await Doctor.findOne({ username : doctorUsername });
    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }

    // Find the contract for the doctor
    const contract = await Contract.findOne({ _id : contractID });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    // Check if the contract is already accepted
    if (contract.status === 'accepted') {
      return res.status(400).json({ error: 'Contract is already accepted.' });
    }

    // Update the contract status to 'accepted'
    contract.status = 'accepted';
    await contract.save();

    doctor.acceptedContract = true;
    await doctor.save();

    res.status(200).json({ message: 'Contract accepted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while accepting the contract.' });
  }
};

//  16.2.1:
const rejectContract = async (req, res) => {
  try {
    const { contractID } = req.body;

    const doctorUsername = req.cookies.username;

    // Find the contract for the doctor
    const contract = await Contract.findOne({ _id : contractID });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }

    // Check if the contract is already accepted
    if (contract.status === 'accepted') {
      return res.status(400).json({ error: 'Contract is already accepted.' });
    }

    // Update the contract status to 'rejected'
    contract.status = 'rejected';
    await contract.save();

    res.status(200).json({ message: 'Contract rejected successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rejecting the contract.' });
  }
};



// 17: Function to add available time slots for appointments
const addAvailableSlots = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const { date, time } = req.body;

    const doctor = await Doctor.findOne({ username: doctorUsername });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Ensure the provided date and time are ahead of the current date and time
    const currentDateTime = new Date();
    const providedDateTime = new Date(`${date}T${time}`);

    if (providedDateTime <= currentDateTime) {
      return res.status(400).json({ error: 'Please provide a date and time ahead of the current date and time.' });
    }

    // Append the new available time slots to the doctor's existing slots
    const newSlot = { time, date };
    doctor.availableSlots.push(newSlot);

    // Save the updated doctor document
    await doctor.save();

    res.status(200).json({ message: 'Available time slots added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding available time slots.' });
  }
};




//  51:
const scheduleAppointment = async (req, res) => {
  try {
    const doctorUsername = req.cookies.username;
    const {patientUsername, dateTime } = req.body;

    const doctor = await Doctor.findOne({ username: doctorUsername });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Create a new appointment for the follow-up or regular appointment
    appointmentPrice = doctor.hourlyRate;
    if (patient.statusOfHealthPackage === "Subscribed"){
      appointmentPrice = doctor.hourlyRate * patient.healthPackage.discountOnSession
    }
    const appointment = new Appointment({
      doctor: doctorUsername,
      patient: patientUsername,
      datetime: new Date(dateTime),
      status: 'Upcoming',
      price: appointmentPrice, 
    });

    // Save the appointment to the database
    await appointment.save();

    const prescription = new Prescription({
      patientName : patientUsername,
      doctorName : doctorUsername,
      date: new Date(dateTime),
      
    })
    await prescription.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scheduling the appointment.' });
  }
};

//  60: 
const addHealthRecord = async (req, res) => {
  try {
    // attachements ba3den ?
    const doctorUsername = req.cookies.username;
    const { patientUsername, diagnosis, treatment, notes, medication, dosage } = req.body;

    // Find the patient by their username
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ username: doctorUsername });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
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

    const prescription = new Prescription({
      patientName : patientUsername,
      doctorName : doctorUsername,
      date: new Date(),
      medication : medication,
      dosage : dosage,
      instructions : treatment,
      filled : true
    })
    await prescription.save();

    res.status(201).json({ message: 'Health record added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding a health record.' });
  }
};


  
module.exports = { viewProfile, updateProfile, viewMyPatients , 
    viewAllPatients, searchPatientByName, filterByUpcomingDate, filterByStatus, 
    selectPatient, viewMyAppointments, searchPatientByUsername , 
    filterByDateRange,viewAllDoctors, searchPatientPrescriptionsByName , 
    viewWallet, filterByPastDate, viewHealthRecords, viewContract, acceptContract , rejectContract ,
    addAvailableSlots, scheduleAppointment, addHealthRecord ,  logout, changePassword  };


