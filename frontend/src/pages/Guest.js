//import React from 'react';
import DoctorRegistrationRequest from "../components/DoctorRegistrationRequest";
import AddPatient from "../components/AddPatient";


const Guest = () => {
  return (
    <div>
<div className="mt-4">
        <DoctorRegistrationRequest />
    </div>
    <div className="mt-4">
    <AddPatient />
</div>
</div>

);}

export default Guest;