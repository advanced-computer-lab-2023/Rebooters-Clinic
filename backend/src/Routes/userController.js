// #Task route solution
const userModel = require('../Models/User.js');
const { default: mongoose } = require('mongoose');

const createUser = async(req,res) => {
   //add a new user to the database with
   //Name, Email and Age
   const { Name, Email, Age } = req.body;
   const user = new userModel({ Name, Email, Age });
   const savedUser = await user.save();
   res.status(201).json(savedUser);

}

const getUsers = async (req, res) => {
   //retrieve all users from the database
   const users = await userModel.find();
   res.status(200).json(users);
  }


const updateUser = async (req, res) => {
   //update a user in the database
   const { Email, newName, newEmail, newAge } = req.body;
   const updateFields = {};
   updateFields.Name = newName;
   updateFields.Email = newEmail;
   updateFields.Age = newAge;
   const updatedUser = await userModel.findOneAndUpdate(
     {Email: Email },
     updateFields,
     { new: true }
   );
   if (!updatedUser) {
     return res.status(404).json({ error: 'User not found' });
   }
   res.status(200).json(updatedUser);
  }

const deleteUser = async (req, res) => {
   //delete a user from the database
   const email = req.body.email;
   const deletedUser = await userModel.findOneAndRemove(email);
   if (!deletedUser) {
     return res.status(404).json({ error: 'User not found' });
   }
   res.status(204).send();
  }


module.exports = {createUser, getUsers, updateUser, deleteUser};
