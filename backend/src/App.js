// External variables
const express = require("express");
const { requireAuth } = require('./Middleware/authMiddleware');
const mongoose = require('mongoose');
const multer = require("multer"); // Import multer here
const storage = multer.memoryStorage();
mongoose.set('strictQuery', false);
require("dotenv").config();
const upload = multer({ storage });
const cookieParser = require('cookie-parser');

const MongoURI = process.env.MONGO_URI ;



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
app.use(cookieParser());



const guestRoutes = require('./Routes/guest');
app.use('/api/guest', guestRoutes);

const patientRoutes = require('./Routes/patient');
app.use('/api/patient' , patientRoutes);

const doctorRoutes = require('./Routes/doctor');
app.use('/api/doctor', doctorRoutes );
 
const administratorRoutes = require('./Routes/administrator')
app.use('/api/administrator',administratorRoutes);


app.get('/doctor-home', requireAuth);
app.get('/patient-home', requireAuth);
app.get('/admin', requireAuth);
