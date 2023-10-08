const Doctor = require('../Models/doctorModel');
const Patient = require('../Models/patientModel');
const Appointment = require('../Models/appointmentModel'); 
const { default: mongoose } = require('mongoose');
const doctorUsername = 'dummydoctor'; //HARD CODING DOCTOR USERNAME

/*const dummyDoctor = new Doctor({
  username: 'dummydoctor',
  password: 'dummydoctorpassword',
  name: 'Dummy Doctor',
  email: 'dummydoctor@example.com',
  dateOfBirth: new Date('1990-01-01'), // Assuming the date of birth is stored as a Date
  hourlyRate: 100.0, // Example hourly rate
  affiliation: 'Hospital ABC',
  speciality: 'Cardiology',
  educationalBackground: 'Medical School XYZ graduate',
  selectedPatients: []
});

dummyDoctor.save(); 

const dummyPatient = new Patient({
  username: 'dummypatient2',
  national_id: '123123123123',
  name: 'Dummy Patient',
  email: 'dummypatient@example.com',
  password: 'dummypatientpassword',
  dateOfBirth: new Date('1995-03-15'),
  gender: 'Female', 
  mobile_number: '123-456-7890',
  emergency_contact: '987-654-3210',
});

dummyPatient.save(); 

const dummyAppointment = new Appointment({
  doctor: 'dummydoctor', 
  patient: 'dummypatient', 
  datetime: new Date('2024-10-25T14:00:00'), 
  status: 'Scheduled', 
  price: 150.0, 
});

dummyAppointment.save()*/


const viewProfile = async (req, res) => {
    try {
        //const doctorUsername = req.body.username;
        const doctor = await Doctor.findOne({ username : doctorUsername });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
          }
      //res.render("profile", { data: profileData }); 
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching profile data' });
    }
};
  
const updateProfile = async (req, res) => {
    try {
      //const doctorUsername = req.body.username;
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
        //const doctorUsername = req.body.username;
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
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for patients' });
  }
};

const viewMyAppointments = async (req, res) => {
  try {
      //const doctorUsername = req.body.username;
    const currentDateTime = new Date();
    const upcomingAppointments = await Appointment.find({ doctor: doctorUsername });
    res.status(200).json(upcomingAppointments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};
  
const filterByDate = async (req, res) => {
    try {
        //const doctorUsername = req.body.username;
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
      //const doctorUsername = req.body.username;
      const { status } = req.body;
      const upcomingAppointments = await Appointment.find({ doctor: doctorUsername });
      const filteredAppointments = upcomingAppointments.filter(appointment => {
        return appointment.status == status;
    });
      res.status(200).json(filteredAppointments);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while filtering patients' });
    }
};
  

const selectPatient = async (req, res) => {
  try {
    //const doctorUsername = req.body.username;
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
  
  
module.exports = { viewProfile, updateProfile, viewMyPatients , 
    viewAllPatients, searchPatientByName, filterByDate, filterByStatus, 
    selectPatient, viewMyAppointments, searchPatientByUsername  };