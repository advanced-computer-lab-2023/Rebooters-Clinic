// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();


const MongoURI = 'mongodb+srv://bissosamir:bissozozo@cluster0.3vkavpd.mongodb.net/';





//App variables
const app = express();
const port = process.env.PORT || "8000";




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
app.get("/", (req, res) => {
    res.status(200).send("Welcome to el7a2ni");
  });



app.use(express.json())



const guestRoutes = require('./Routes/guest');
app.use('/api/guest', guestRoutes);

const patientRoutes = require('./Routes/patient');
app.use('/api/patient' , patientRoutes);

const doctorRoutes = require('./Routes/doctor');
app.use('/api/doctor', doctorRoutes );
 
const administratorRoutes = require('./Routes/administrator')
app.use('/api/administrator',administratorRoutes);



