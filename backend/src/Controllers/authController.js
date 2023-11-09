const Patient = require('../Models/patientModel'); // Import the Patient model
const Admin = require('../Models/administratorModel');
const Doctor = require('../Models/doctorModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const nodemailer = require('nodemailer');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
    return jwt.sign({ username }, 'supersecret', {
        expiresIn: maxAge
    });
};

const logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); 
    res.status(200).json({ message: 'Logged out successfully' });
  };
  
const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const username = req.cookies.username; // Assuming you store the username in cookies

    // Validate the new password
    if (!validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        return res.status(400).json({ error: 'New password does not meet the criteria' });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    try {
        let user;

        // Retrieve the user from the appropriate model based on the user type
        const userType = req.cookies.userType; // Assuming you store the user type in cookies

        switch (userType) {
            case 'patient':
                user = await Patient.findOne({ username });
                break;
            case 'doctor':
                user = await Doctor.findOne({ username });
                break;
            case 'admin':
                user = await Admin.findOne({ username });
                break;
            default:
                return res.status(400).json({ error: 'Invalid user type' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the current password is correct
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Hash the new password and update it in the data store
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while changing the password' });
    }
};

// const otpStorage = new Map(); // Temporary storage for OTPs

// // Generate a random 6-digit OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send OTP to the user's email
// const sendOTPByEmail = async (email, otp) => {
//   // Create a nodemailer transporter for sending emails
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail', // e.g., Gmail
//     auth: {
//       user: 'shahdsharaf02@gmail.com',
//       pass: 'Ss10082002',
//     },
//   });

//   // Define email data
//   const mailOptions = {
//     from: 'shahdsharaf02@gmail.com',
//     to: email,
//     subject: 'Password Reset OTP',
//     text: `Your OTP for password reset is: ${otp}`,
//   };

//   // Send the email
//   return new Promise((resolve, reject) => {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(info);
//       }
//     });
//   });
// };

// // Function to request OTP for password reset
// const requestPasswordResetOTP = async (req, res) => {
//   const { email, userType } = req.body;

//   let user;

//   // Check if the user with the provided email exists in the appropriate model
//   if (userType === 'patient') {
//     user = await Patient.findOne({ email });
//   } else if (userType === 'admin') {
//     user = await Admin.findOne({ email });
//   } else if (userType === 'pharmacist') {
//     user = await Pharmacist.findOne({ email });
//   } else {
//     return res.status(400).json({ error: 'Invalid user type' });
//   }

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   // Generate a random OTP
//   const otp = generateOTP();

//   // Store the OTP in temporary storage (you should use a database for production)
//   otpStorage.set(email, otp);

//   try {
//     // Send the OTP to the user's email
//     await sendOTPByEmail(email, otp);

//     // Return a success response
//     res.status(200).json({ message: 'OTP sent successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to send OTP' });
//   }
// };

// // Function to reset the password with OTP and a new password
// const resetPasswordWithOTP = async (req, res) => {
//   const { email, otp, newPassword, userType } = req.body;

//   // Check if the provided OTP matches the stored OTP for the email
//   if (otp !== otpStorage.get(email)) {
//     return res.status(400).json({ error: 'Invalid OTP' });
//   }

//   // Check if the new password meets your criteria
//   if (!validator.isStrongPassword(newPassword, {
//     minLength: 8,
//     minLowercase: 1,
//     minUppercase: 1,
//     minNumbers: 1,
//     minSymbols: 1,
//   })) {
//     return res.status(400).json({ error: 'New password does not meet the criteria' });
//   }

//   // Update the user's password in the appropriate model
//   const hashedPassword = await bcrypt.hash(newPassword, 10);

//   if (userType === 'patient') {
//     await Patient.updateOne({ email }, { password: hashedPassword });
//   } else if (userType === 'admin') {
//     await Admin.updateOne({ email }, { password: hashedPassword });
//   } else if (userType === 'pharmacist') {
//     await Pharmacist.updateOne({ email }, { password: hashedPassword });
//   } else {
//     return res.status(400).json({ error: 'Invalid user type' });
//   }

//   // Clear the stored OTP for security
//   otpStorage.delete(email);

//   // Return a success response
//   res.status(200).json({ message: 'Password reset successful' });
// };

module.exports= {logout, changePassword, createToken};