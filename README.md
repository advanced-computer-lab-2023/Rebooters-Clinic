 
# El7a2ny: A Virtual Clinic and Pharmacy System
El7a2ny is a software solution for clinics, doctors,
pharmacists and patients alike to streamline and automate the interactions between patients, medical doctors and pharmacists. This encompasses everything from trying to
find a doctor, scheduling meetings with doctors, conducting on-premise or online meetings, getting prescriptions, getting reminders for follow-ups, accessing medical history,
and ordering medication that was prescribed.

## Motivation
This project's purpose was initially, mainly for academic purposes. We learnt a ton of information on how to use MERN Stack which is an abbreviation for Mongodb, Express.js, React.js, Node.js. React and JavaScript being probably the most used framework for frontend and backend Web/App development made this project very fruitful. However, while developing the project, the team was motivated to design this project as if it were to be a real, usable website for people one day. We tried enhancing the UI/UX as much as possible to make the user want to recommend this website to other people.
## Build Status
This project is supposedly built to have no bugs/errors however, in terms of speed, you can definitely tell the project is running using free database servers. This causes the speed at which database fetches important data slower than we would like. This sometimes causes run-time errors as the website is trying to use an object that it fetched from the database, but due to the slow-fetch from the database it causes an error.
Additionally, it might not be considered a bug, but it is worth noting you can not sign in on 2 different accounts from the same browser application eg: Chrome, what will happen is that it will sign you out of the previous account and focus on the freshly signed in account.

## Code Style
Standard coding conventions.
## Screenshots

## Tech/Framework Used
MERN Stack

**Client:** React, Bootstrap

**Server:** Node, Express, Mongodb


## Features

- Intuitive UI/UX
- Cross Platform
## Usage/Examples
#### Code Examples from the guestController.js
```javascript
const login = async(req, res) => {
  const { username, password } = req.body;
  try {
    let user;
    type = "";

    // Search for the username in Patients
    user = await Patient.findOne({ username });
    type = "patient";
    if (!user) {
        // Search for the username in Admins
        user = await Admin.findOne({ username });
        type = "admin";
    }
    if (!user) {
        // Search for the username in Pharmacists
        user = await Doctor.findOne({ username });
        type = "doctor";
    }

    if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const token = createToken(user.username);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.cookie('userType', type, { httpOnly: true, maxAge: maxAge * 1000 });
            res.cookie('username', username, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ username, token, type});
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }

        //DO REDIRECTING ACCORDING TO TYPE

    } else {
        res.status(401).json({ error: 'User not found' });
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in.' });
}
};
```


```javascript
const createPatient = async (req, res) => {
    try {
      const {username,name,email,password,dateOfBirth,gender,mobile_number,emergency_contact} = req.body; 
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newPatient = new Patient({username,name,email,password:hashedPassword,dateOfBirth,gender,mobile_number,emergency_contact});
      await newPatient.save();
      const token = createToken(newPatient._id);
      res.status(200).json({username, token});
      } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the patient.' });
    }
  };
```
#### Code Examples from the patientController.js
```javascript
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
```

```javascript
const viewMyAppointments = async (req, res) => {
  try {
    const patientUsername = req.cookies.username;
    const myAppointments = await Appointment.find({ patient: patientUsername });
    res.status(200).json(myAppointments);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
```

#### Code Examples from the doctorController.js
```javascript
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

```

```javascript
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

   /* const prescription = new Prescription({
      patientName: patientUsername,
      doctorUsername: doctorUsername,
      doctorName : doctor.name,
      date: new Date(dateTime),
    });
    await prescription.save();*/

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while scheduling the appointment." });
  }
};
```
#### Code Examples from the AdminController.js
```javascript
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
```
```javascript
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
```
## Installation

- [Install VS Code](https://code.visualstudio.com/download)
- [Install Node](http://nodejs.org/)
- [Install Git](https://git-scm.com/downloads)
After downloading these two, open a terminal and do the following:
```bash
  npm install -g nodemon
  npm install -g express
  npm install -g mongoose
```

## API Reference

#### Stripe API 

https://stripe.com/docs

### Guest API

#### Login

```http
POST /api/guest/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Your Username |
| `password` | `string` | **Required**. Your Password |

#### Patient Registration

```http
POST /api/guest/createPatient
```

| Parameter                  | Type     | Description                                      |
| :------------------------- | :------- | :----------------------------------------------- |
| `username`                 | `string` | **Required**. Username of the user               |
| `name`                     | `string` | **Required**. Name of the user                   |
| `email`                    | `string` | **Required**. Email address of the user          |
| `password`                 | `string` | **Required**. Password for authentication   |
| `dateOfBirth`              | `string` | **Required**. Date of birth of the user          |
| `gender`                   | `string` | **Required**. Gender of the user                 |
| `mobile_number`            | `string` | **Required**. Mobile number of the user          |
| `emergency_contact`        | `object` | **Required**. Emergency contact information      |
| `emergency_contact.firstName` | `string` | First name of the emergency contact           |
| `emergency_contact.middleName` | `string` | Middle name of the emergency contact          |
| `emergency_contact.lastName`  | `string` | Last name of the emergency contact            |
| `emergency_contact.mobile_number` | `string` | Mobile number of the emergency contact    |


#### Request to be a Doctor on the System

```http
POST /api/guest/createNewDoctorRequest
```

| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `username`             | `string` | **Required**. Username of the user    |
| `name`                 | `string` | **Required**. Name of the user        |
| `email`                | `string` | **Required**. Email address of the user |
| `password`             | `string` | **Required**. Password for authentication |
| `dateOfBirth`          | `string` | **Required**. Date of birth of the user |
| `hourlyRate`           | `string` | **Required**. Hourly rate of the doctor             |
| `affiliation`          | `string` | **Required**. Affiliation of the doctor             |
| `speciality`           | `string` | **Required**. Speciality of the doctor              |
| `educationalBackground`| `string` | **Required**. Educational background of the doctor  |
| `idDocument`| `file` | **Required**. Upload copy of ID (png/pdf/..)  |
| `medicalLicense`| `file` | **Required**. Upload copy of medical license (png/pdf/..) |
| `medicalDegree`| `file` | **Required**. Upload copy of medicalDegree (png/pdf/..)  |

#### Request Password Reset OTP

```http
POST /api/guest/requestPasswordResetOTP
```
| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `email`   | `string` | **Required**. Email address    |

#### Reset Password with OTP

```http
POST /api/guest/resetPasswordWithOTP
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `email`        | `string` | **Required**. Email address          |
| `otp`          | `string` | **Required**. One-Time Password (OTP) |
| `newPassword`  | `string` | **Required**. New password for the user |

### Patient API
**Note**: All the following routes requires the patient to be logged in. Upon logging in the patient username gets stored in the cookies to be used in each route.
#### Logout

```http
GET /api/patient/logout
```
#### Change Password

```http
POST /api/patient/changePassword
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `currentPassword`        | `string` | **Required**. Old Password          |
| `newPassword`          | `string` | **Required**. New Password |
| `confirmPassword `  | `string` | **Required**. Confirmed new Password |

#### Pay for Appointment

```http
POST /api/patient/payForAppointment
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `appointmentID`        | `string` | **Required**. ID of Appointment to pay for          |
| `paymentMethod`          | `string` | **Required**. method can be wallet/credit card |

#### Pay For Health Package

```http
POST /api/patient/payForHealthPackage
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `packageName`        | `string` | **Required**. Name of desired package        |
| `paymentMethod`          | `string` | **Required**. method can be wallet/credit card |

#### Create a patient account for family member

```http
POST /api/patient/createNotFoundPatient
```
| Parameter                  | Type     | Description                                      |
| :------------------------- | :------- | :----------------------------------------------- |
| `username`                 | `string` | **Required**. Username of the user               |
| `name`                     | `string` | **Required**. Name of the user                   |
| `email`                    | `string` | **Required**. Email address of the user          |
| `password`                 | `string` | **Required**. Password for authentication   |
| `dateOfBirth`              | `string` | **Required**. Date of birth of the user          |
| `gender`                   | `string` | **Required**. Gender of the user                 |
| `mobile_number`            | `string` | **Required**. Mobile number of the user          |
| `emergency_contact`        | `object` | **Required**. Emergency contact information      |
| `emergency_contact.firstName` | `string` | First name of the emergency contact           |
| `emergency_contact.middleName` | `string` | Middle name of the emergency contact          |
| `emergency_contact.lastName`  | `string` | Last name of the emergency contact            |
| `emergency_contact.mobile_number` | `string` | Mobile number of the emergency contact    |

#### Upload Medical History

```http
POST /api/patient/addMedicalHistory
```

| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `medicalHistory`             | `file` | **Required**. Upload medical history file (png/pdf/..)    |

#### View Medical History

```http
GET /api/patient/viewMedicalHistory
```
#### Delete Medical History

```http
DELETE /api/patient/deleteMedicalHistory/:filename
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `filename`             | `string` | **Required**. Name of file to delete    |

#### Create Prescription

```http
POST /api/patient/createPrescription
```
| Parameter          | Type     | Description                           |
| :----------------- | :------- | :------------------------------------ |
| `patientName`      | `string` | **Required**. Name of the patient     |
| `doctorName`       | `string` | **Required**. Name of the doctor      |
| `medication`       | `string` | **Required**. Medication information  |
| `dosage`           | `string` | Dosage information                    |
| `instructions`     | `string` | Instructions for medication usage    |
| `prescriptionDate` | `string` | **Required**. Date of the prescription |
| `filled`           | `boolean`| Whether the prescription is filled   |

#### View all Prescriptions

```http
POST /api/patient/viewAllPrescriptions
```

#### Cancel Appointment

```http
POST /api/patient/cancelAppointment
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `appointmentGiven`     | `string` | **Required**. ID of Appointment to be cancelled    |


 #### View Health Package Options

```http
GET /api/patient/viewHealthPackageOptions
```
 #### View Subscribed Health Package 

```http
GET /api/patient/viewHealthPackage
```

#### Add family member

```http
POST /api/patient/addFamilyMember
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `familyMemberUsername`     | `string` | **Required**. Username of famiy member    |
| `relation `     | `string` | **Required**. Relation to that member (Wife/Husband/Child)   |


#### View Doctors

```http
POST /api/patient/viewDoctors
```
#### Find Doctor

```http
POST /api/patient/findDoctor
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `speciality`     | `string` | **Required**. Speciality of doctor    |
| `name `     | `string` | **Required**. Name of doctor  |

#### Make Appointment

```http
POST /api/patient/makeAppointment
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `doctorUsername `     | `string` | **Required**. Username of doctor  |
| `chosenSlot`     | `string` | **Required**. Chosen slot to be reserved    |
| `reservingUser`     | `string` | **Required**. Myself/Family member  |

#### Subscribe to Health Package

```http
POST /api/patient/subscribeToHealthPackage
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `packageName `     | `string` | **Required**. Name of Package |
| `subscribingUser `     | `string` | **Required**. Myself/Family member    |

#### Unsubscribe to Health Package

```http
POST /api/patient/unsubscribeToHealthPackage
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `unsubscribingUser  `     | `string` | **Required**. Myself/Family member    |

#### Filter doctor list

```http
POST /api/patient/filterDoctor
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `speciality  `     | `string` | **Required**. Filter by doctor speciality    |
| `date  `     | `string` | **Required**. Filter by doctor availability    |

#### View Registered Family Members

```http
POST /api/patient/viewRegisteredFamilyMembers
```

#### Filter Appointments Within a Date Range

```http
POST /api/patient/filterAppointmentsByDate
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `startDate  `     | `string` | **Required**. Start Date   |
| `endDate  `     | `string` | **Required**. End Date    |
| `familyUsername  `     | `string` | **Required**. Filter for myself/family member    |
 
#### Filter Appointments by Status

```http
POST /api/patient/filterAppointmentsByStatus
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `appointmentStatus  `     | `string` | **Required**. Completed/Upcoming/Cancelled/Rescheduled   |
| `familyUsername  `     | `string` | **Required**. Filter for myself/family member    |
 
#### View Available Slots for a Doctor

```http
POST /api/patient/viewAvailableDoctorSlots 
```
| Parameter              | Type     | Description                           |
| :--------------------- | :------- | :------------------------------------ |
| `doctorUsername  `     | `string` | **Required**. Doctor username|

#### Filter Prescriptions

```http
POST /api/patient/filterPrescriptions
```

| Parameter     | Type      | Description                               |
| :------------ | :-------- | :---------------------------------------- |
| `date`        | `string`  | **Required**. Date for filtering prescriptions          |
| `doctorName`  | `string`  | **Required**. Name of the doctor for filtering          |
| `filled`      | `boolean` | **Required**. Flag to filter filled or unfilled prescriptions |

#### Select Doctor

```http
GET /api/patient/selectDoctor
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `findDoctorResults`     | `string` | Results from finding doctors                  |
| `filterDoctorResults`   | `string` | Results from filtering doctors                |

#### View My Appointments

```http
POST /api/patient/viewMyAppointments
```

#### View My Wallet

```http
POST /api/patient/view-wallet
```
#### Filter Past Appointments

```http
POST /api/patient/past-appointments
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `familyUsername`     | `string` | **Required**. Filter for Myself/family memeber                |

#### Filter Upcoming Appointments

```http
POST /api/patient/upcoming-appointments
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `familyUsername`     | `string` | **Required**. Filter for Myself/family memeber                |

#### View Health Records

```http
POST /api/patient/health-records
```

#### Request from a Doctor a follow up Appointment

```http
POST /api/patient/requestFollowUp
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `reason`     | `string` | **Required**. Reason for follow up request               |
| `preferredDate`     | `string` | **Required**. Preferred date of follow up   |
| `datetime`     | `string` | **Required**. Date of previous appointment |

#### Reschedule Appointment

```http
POST /api/patient/rescheduleAppointment
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `datetime`     | `string` | **Required**. Date of appointment to be reschedulled               |
| `doctorUsername`     | `string` | **Required**. Doctor username   |
| `newdate`     | `string` | **Required**. New date of appointment |

#### View Family Members Health Packages

```http
GET /api/patient/viewFamilyMembersHealthPackages
```
#### View Medicines

```http
GET /api/patient/viewMedicines
```

#### View Family member Appointments

```http
POST /api/patient/upcoming-appointments
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `familyUsername`     | `string` | **Required**. Family member username|

#### Payment with wallet 

```http
PUT /api/patient/payWithWallet
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `value`     | `number` | **Required**. Value to be paid|

#### Get Available Doctors

```http
GET /api/patient/getAvailableDoctors
```

#### Start new chat with a Doctor

```http
POST /api/patient/startNewChatWithDoctor
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `messageContent`     | `string` | **Required**. Message to be sent|
| `selectedDoctor`     | `string` | **Required**. Doctor to chat with|


#### Continue chat with a Doctor

```http
POST /api/patient/continueChatWithDoctor
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `messageContent`     | `string` | **Required**. Message to be sent|
| `chatId`     | `string` | **Required**. ID of chat to continue on|


#### View all Chats

```http
GET /api/patient/viewMyChats
```

#### Close chat with doctor

```http
POST /api/patient/deleteChatWithDoctor
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `chatId`     | `string` | **Required**. ID of chat to close|

#### View all doctors patient had appointment with

```http
GET /api/patient/viewLinkedDoctors
```

#### Video call with a doctor

```http
POST /api/patient/createZoomMeetingNotification
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `doctorUsername `     | `string` | **Required**. Username of doctor to video call|


#### Get Patient Notifications

```http
GET /api/patient/getPatientNotifications
```

#### Hide a notification

```http
POST /api/patient/hideNotification
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `notificationId `     | `string` | **Required**. Notification ID to hide|

#### View patient profile

```http
GET /api/patient/viewProfile
```

### Doctor API

**Note**: All the following routes requires the doctor to be logged in. Upon logging in the doctor username gets stored in the cookies to be used in each route.
#### Logout

```http
GET /api/doctor/logout
```
#### Change Password

```http
POST /api/doctor/changePassword
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `currentPassword`        | `string` | **Required**. Old Password          |
| `newPassword`          | `string` | **Required**. New Password |
| `confirmPassword `  | `string` | **Required**. Confirmed new Password |

#### View Profile

```http
POST /api/doctor/doctor-profile
```

#### Update Profile

```http
POST /api/doctor/doctor-update-profile
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `email`        | `string` | **Required**. Update Email         |
| `hourlyRate`          | `string` | **Required**. Update Hourly Rate |
| `affiliation `  | `string` | **Required**. Update Affiliation |

#### View doctor's patients

```http
POST /api/doctor/doctor-mypatients
```

#### View all patients

```http
POST /api/doctor/doctor-patients
```

#### View all doctors

```http
POST /api/doctor/viewAllDoctors
```

#### Search for patient by name

```http
POST /api/doctor/doctor-patients-name
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `name`        | `string` | **Required**. Patient name         |


#### Search for patient by username

```http
POST /api/doctor/doctor-patients-username
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `username`        | `string` | **Required**. Patient username         |

#### Filter appointments by upcoming date

```http
POST /api/doctor/doctor-patients/upcoming-date-filter
```

#### Filter appointments by status

```http
POST /api/doctor/doctor-patients/status-filter
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `status`        | `string` | **Required**. Completed/Upcoming/Cancelled/Rescheduled |

#### Select patient

```http
POST /api/doctor/doctor-select-patients
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `patientUsernames`        | `string` | **Required**. Patient username|

#### View doctor's appointments

```http
POST /api/doctor/doctor-myappointments
```

#### Filter appointments by date range

```http
POST /api/doctor/doctor-patients/date-range-filter
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `startDate`        | `string` | **Required**. Start date|
| `endDate`        | `string` | **Required**. End date |

#### Get prescriptions of a patient

```http
POST /api/doctor/doctor-patients/get-prescriptions
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `patientName `        | `string` | **Required**. Patient's name|

#### View wallet

```http
POST /api/doctor/view-wallet
```

#### Filter appointments by past date

```http
POST /api/doctor/past-appointments
```

#### Get health records of a patient

```http
POST /api/doctor/get-health-records
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `patientUsername  `        | `string` | **Required**. Patient's username|

#### Get doctor's contract

```http
GET /api/doctor/viewContract
```

#### Accept doctor's contract

```http
POST /api/doctor/acceptContract
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `contractID  `        | `string` | **Required**. ID of contract to accept|

#### Reject doctor's contract

```http
POST /api/doctor/rejectContract
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `contractID  `        | `string` | **Required**. ID of contract to reject|


#### Add available slots

```http
POST /api/doctor/addAvailableSlots
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `datetime   `        | `string` | **Required**. Datetime of available slot|

#### Schedule appointment for patient

```http
POST /api/doctor/scheduleAppointment
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `dateTime   `        | `string` | **Required**. Datetime of available slot|
| `patientUsername  `        | `string` | **Required**. Patient's username|

#### Add health record for patient

```http
POST /api/doctor/addHealthRecord
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `patientUsername  `        | `string` | **Required**. Patient's username|
| `diagnosis   `        | `string` | **Required**. Diagnosis of patient|
| `treatment   `        | `string` | **Required**. Treatment for the diagnosis|
| `notes   `        | `string` | Extra notes|

#### Add prescription for patient

```http
POST /api/doctor/addPrescription 
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `patientUsername  `        | `string` | **Required**. Patient's username|
| `medicationInfo`        | `object` | **Required**. Medication information of the prescription   |
| `medicationInfo.medicine` | `string` | **Required**. Medicine name  |
| `medicationInfo.dosage` | `string` | **Required**. Dosage of medicine |
| `medicationInfo.instructions`  | `string` | **Required**. Instructions on medicine |


#### Remove medication from a prescription for a patient

```http
POST /api/doctor/removeFromPrescription 
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `patientUsername  `        | `string` | **Required**. Patient's username|
| `prescriptionID` | `string` | **Required**. ID of prescription to edit|
| `medicineIndex ` | `string` | **Required**. Index of medicine to remove |

#### Add medication To a prescription for a patient

```http
POST /api/doctor/addToPrescription 
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `patientUsername  `        | `string` | **Required**. Patient's username|
| `prescriptionID` | `string` | **Required**. ID of prescription to edit|
| `medicine ` | `object` | **Required**. Medicine information |
| `medicine.medicine` | `string` | **Required**. Medicine name  |
| `medicine.dosage` | `string` | **Required**. Dosage of medicine |
| `medicine.instructions`  | `string` | **Required**. Instructions on medicine |


#### Edit medication on a prescription for a patient

```http
POST /api/doctor/editPrescription 
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `patientUsername `| `string` | **Required**. Patient's username|
| `prescriptionID` | `string` | **Required**. ID of prescription to edit|
| `medicineIndex ` | `string` | **Required**. Index of medicine to remove |
| `dosage` | `string` | **Required**. Dosage of medicine  |
| `instructions` | `string` | **Required**. Instructions on medicine |

#### Cancel Appointment

```http
POST /api/doctor/cancelAppointment 
```

| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `appointmentGiven `| `string` | **Required**. ID of appointment|


#### Send message to a pharmacist

```http
POST /api/doctor/sendMessageToPharmacist
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `messageContent`     | `string` | **Required**. Message to be sent|
| `chatId`     | `string` | **Required**. ID of chat|


#### View all chats

```http
GET /api/doctor/viewAllChats
```

#### Start new chat with a pharmacist

```http
POST /api/doctor/startNewChat
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `messageContent`     | `string` | **Required**. Message to be sent|

#### View my chats + any chat request from patients

```http
GET /api/doctor/viewMyChats
```

#### Continue chat 

```http
POST /api/doctor/startNewChat
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `messageContent`     | `string` | **Required**. Message to be sent|
| `chatId`     | `string` | **Required**. ID of chat|


#### Close chat 

```http
DELETE /api/doctor/deleteChat/:chatId
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `chatId`     | `string` | **Required**. ID of chat|

#### Accept follow up request 

```http
POST /api/doctor/acceptFollowUpRequest
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `datetime `     | `string` | **Required**. New date time |

#### Revoke follow up request 

```http
POST /api/doctor/revokeFollowUpRequest
```

#### Reschedule an appointment

```http
POST /api/doctor/rescheduleAppointment
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `datetime `     | `string` | **Required**. Old date time |
| `newDatetime  `     | `string` | **Required**. New date time |


#### Get follow up requests 

```http
GET /api/doctor/getDoctorFollowUpRequests
```

#### View My Chats With Patients

```http
GET /api/doctor/viewMyChatsWithPatients
```

#### View all my patients

```http
GET /api/doctor/viewLinkedPatients
```

#### Start new chat with a Patient

```http
POST /api/doctor/startNewChatWithPatient
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `messageContent`     | `string` | **Required**. Message to be sent|
| `selectedPatient`     | `string` | **Required**. Patient to chat with|


#### Continue chat with a Patient

```http
POST /api/doctor/continueChatWithPatient
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `messageContent`     | `string` | **Required**. Message to be sent|
| `chatId`     | `string` | **Required**. ID of chat|

#### Close chat with a patient

```http
POST /api/doctor/deleteChatWithPatient
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `chatId`     | `string` | **Required**. ID of chat to close|


#### Video call with a patient

```http
POST /api/doctor/createZoomMeetingNotification
```
| Parameter               | Type   | Description                                    |
| :---------------------- | :----- | :--------------------------------------------- |
| `patientUsername `     | `string` | **Required**. Username of doctor to video call|

#### Get Doctor Notifications

```http
GET /api/doctor/getDoctorNotifications
```

### Administrator API
**Note**: All the following routes requires the admin to be logged in. Upon logging in the admin username gets stored in the cookies to be used in each route.
#### Logout

```http
GET /api/administrator/logout
```
#### Change Password

```http
POST /api/administrator/changePassword
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `currentPassword`        | `string` | **Required**. Old Password|
| `newPassword`          | `string` | **Required**. New Password |
| `confirmPassword `  | `string` | **Required**. Confirmed new Password |

#### Add an administrator

```http
POST /api/administrator/addAdministrator
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `email`        | `string` | **Required**. Email of admin|
| `username`          | `string` | **Required**. Username of admin|
| `password `  | `string` | **Required**. Password of admin |


#### Delete a user

```http
DELETE /api/administrator/removeUserFromSystem
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `username`        | `string` | **Required**. Username of user to delete|

#### View Doctor Application

```http
GET /api/administrator/viewDoctorApplication
```

#### Delete a health package

```http
DELETE /api/administrator/deleteHealthPackage
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `name`        | `string` | **Required**. Name of package to delete|

#### Edit a health package

```http
POST /api/administrator/editHealthPackage
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `name`        | `string` | **Required**. Name of package to edit|
| `price`          | `string` | **Required**. Updated price|
| `discountOnSession `  | `string` | **Required**. Updated discount on session |
| `discountOnMedicine `  | `string` | **Required**. Updated discount on medicine |
| `discountOnSubscription `  | `string` | **Required**. Updated discount on Subscription |

#### Add a health package

```http
POST /api/administrator/addHealthPackage
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `name`        | `string` | **Required**. Name of package |
| `price`          | `string` | **Required**. price|
| `discountOnSession `  | `string` | **Required**. discount on session |
| `discountOnMedicine `  | `string` | **Required**. discount on medicine |
| `discountOnSubscription `  | `string` | **Required**. discount on Subscription |

#### View all patients

```http
GET /api/administrator/viewAllPatients
```

#### Approve a Doctor Registration Request

```http
POST /api/administrator/approveDoctorRequest
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `username`        | `string` | **Required**. Username of doctor |

#### Reject a Doctor Registration Request

```http
POST /api/administrator/rejectDoctorRequest
```
| Parameter      | Type     | Description                          |
| :------------- | :------- | :----------------------------------- |
| `username`        | `string` | **Required**. Username of doctor |

#### View all available health packages

```http
GET /api/administrator/viewHealthPackages
```

#### View all doctors

```http
GET /api/administrator/viewAllDoctors
```

#### View all admins

```http
GET /api/administrator/viewAllAdmins
```
## Running Tests

To run tests to make sure the routes are working fine, download [Postman](https://www.postman.com/downloads/) software for free.

//screen shots of postman?


## How to Use?
Open git bash/ or any terminal in a directory of your choice and do: 
```bash
  git clone **paste the github clone link here**
```
Open a terminal inside the project directory and do the following:
```bash
  cd backend
  npm install
  cd ..
  cd frontend
  npm install
```
To run the project, you need to open two terminals, in the first one:
```bash
  cd backend
  cd src
  nodemon app.js OR node app.js
```
In the second one:
```bash
  cd frontend
  npm start
```
Then try using the website by registering as a patient and immediately getting access to the patient dashboard!
## Contributing

Public Contributions are unfortunately not welcome yet as per this project's team decision; this project is still private.


## Credits
Full credit goes to [NetNinja](https://www.youtube.com/@NetNinja) youtube channel for their wonderful playlist on [MERN Stack](https://www.youtube.com/watch?v=98BzS5Oz5E4&list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE&index=1&ab_channel=NetNinja) with the most thorough explanation on the framework.

## Authors

- [@minatamer](https://github.com/minatamer)
- [@BasselTharwat](https://github.com/BasselTharwat)
- [@rawanfarouq](https://github.com/rawanfarouq)
- [@mayamokhtarr](https://github.com/mayamokhtarr)
- [@shahdsharaf](https://github.com/shahdsharaf)
- [@toniskander](https://github.com/toniskander)
- [@hayaelsarraf](https://github.com/hayaelsarraf)
- [@ragyihab](https://github.com/ragyihab)


## License

Apache 2.0 license 


