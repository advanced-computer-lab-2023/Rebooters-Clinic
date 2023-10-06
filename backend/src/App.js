// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const {createPatient,selectDoctorByName,ViewselectDoctorDetails,createPrescription,viewAllPrescriptions} = require("./Routes/patientController");
const MongoURI = 'mongodb+srv://rawanfarouq576:Confirm31_@mernapp.wjwy5y5.mongodb.net/' ;



//App variables
const app = express();
const port = process.env.PORT || "8000";
const patient = require('./Models/Patient');
// #Importing the userController


// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
/*
                                                    Start of your code
*/
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });

 

// #Routing to userController here

app.use(express.json())
app.post("/addPatient",createPatient);
app.get("/doctor", selectDoctorByName);
app.get("/doctorDetails", ViewselectDoctorDetails);
app.post("/addPrescription",createPrescription);  
app.get("/viewPrescription", viewAllPrescriptions);




