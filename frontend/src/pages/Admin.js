import { useEffect, useState } from "react";
import AddHealthPackage from "../components/AddHealthPackage";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {
    
    return (
      <div className="container">
        <div className="mt-4">
          <AddHealthPackage />
        </div>
       
      </div>
      
    );
  };
  
  export default Admin;