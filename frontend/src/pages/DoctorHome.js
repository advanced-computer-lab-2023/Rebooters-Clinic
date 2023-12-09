import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorMyPatients from "../components/DoctorMyPatients";
import SearchForPatient from "../components/SearchForPatient";
//import DoctorPatients from "../components/DoctorPatients";
import DoctorUpdateProfile from "../components/DoctorUpdateProfile";
import DoctorMyAppointments from "../components/DoctorMyAppointments";
import DoctorWallet from "../components/DoctorWallet";
import ChangePassword from "../components/ChangePassword";
import "bootstrap/dist/css/bootstrap.min.css";
import Contract from "../components/Contract";
import TimeSlots from "../components/TimeSlots";
import DoctorChats from "../components/DoctorChats";
import DoctorSendsToPharm from "../components/DoctorSendsToPharm";
import FollowUpRequests from "../components/FollowUpRequests";
import DoctorChatsPatients from "../components/DoctorChatsPatients";
import NotificationsDoctor from "../components/NotificationsDoctor";
import CombinedDoctorMyPatientsAndSearch from "../components/CombinedDoctorMyPatientsAndSearch";
import { useNotificationContext } from "../context/NotificationsContext";

const DoctorHome = () => {
  const { notifications, incrementNotifications } = useNotificationContext();
  const [prevNotifications, setPrevNotifications] = useState(0);
  const [doctorData, setDoctorData] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();


  const getDoctorNotifications = async () => {
    try {
      const response = await fetch('/api/doctor/getDoctorNotifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();

        // Check if the count of notifications increased
        if (data.length > notifications) {
          incrementNotifications();
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    // Fetch notifications initially
    getDoctorNotifications();

    

    // Set up an interval to fetch notifications periodically
    const intervalId = setInterval(getDoctorNotifications, 5000); // Fetch every 0.5 seconds, for example

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [notifications, incrementNotifications]);


  useEffect(() => {
    const checkUserType = async () => {
      try {
        const response = await fetch("/doctor-home");
        if (response.status === 401 || response.status === 403) {
          navigate("/", { state: { errorMessage: "Access Denied" } });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserType();
  }, []);
  const viewProfile = async () => {
    try {
      const response = await fetch("/api/doctor/doctor-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        json.dateOfBirth = new Date(json.dateOfBirth).toLocaleDateString();
        setDoctorData(json);
      } else {
        setDoctorData("");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/doctor/logout", {
        method: "GET",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    viewProfile();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'notifications') {
      setPrevNotifications(notifications); // Reset notifications when clicking on the Notifications tab
    }
  };
  return (
    <div className="container">
      {doctorData && doctorData.acceptedContract ? (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li>
                <button
                  className="nav-link btn btn-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
              <li
                className={`nav-item ${activeTab === "home" ? "active" : ""}`}
              >
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("home")}
                >
                  Home
                </button>
              </li>
              <li
                className={`nav-item ${
                  activeTab === "settings" ? "active" : ""
                }`}
              >
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("settings")}
                >
                  Settings
                </button>
              </li>
              <li
                className={`nav-item ${
                  activeTab === "appointments" ? "active" : ""
                }`}
              >
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("appointments")}
                >
                  Appointments
                </button>
              </li>
              <li
                className={`nav-item ${
                  activeTab === "patients" ? "active" : ""
                }`}
              >
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("patients")}
                >
                  Patients
                </button>
              </li>
              <li
                className={`nav-item ${activeTab === "chat" ? "active" : ""}`}
              >
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleTabClick("chat")}
                >
                  Chat
                </button>
              </li>
              <li
              className={`nav-item ${
              activeTab === "notifications" ? "active" : ""
              }`}
                >
           <button
             className={`nav-link btn btn-link`} // Apply bold style if new notifications exist
                onClick={() => handleTabClick("notifications")}
            >
             Notifications {notifications > prevNotifications && <strong>({notifications - prevNotifications})</strong>}
           </button>
            </li>
            </ul>
          </div>
        </nav>
      ) : null}
      {activeTab === "home" && (
          <div className="container">
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar7.png" // Replace this with the URL of a doctor's avatar image
                  alt="Doctor"
                  className="rounded-circle p-1 bg-primary"
                  width="110"
                />
                <div className="mt-3">
                  <h4>{doctorData.name}</h4>
                  <p className="text-secondary mb-1">{doctorData.speciality}</p>
                </div>
              </div>
              <hr className="my-4" />
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{doctorData.name}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{doctorData.email}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Date of Birth</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{doctorData.dateOfBirth}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Hourly Rate</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{doctorData.hourlyRate}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Speciality</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{doctorData.speciality}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Affiliation</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{doctorData.affiliation}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Educational Background</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  <span>{doctorData.educationalBackground}</span>
                </div>
              </div>
              {/* You can add more rows as per the doctor's data */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}


      {doctorData && !doctorData.acceptedContract ? (
        <div className="card mt-4">
          <Contract />
        </div>
      ) : (
        <>
          {activeTab === "home" && (
            <div className="card mt-4">
              {activeTab === "home" && <DoctorWallet />}
            </div>
          )}
          {activeTab === "settings" && (
            <div className="card mt-4">
              {activeTab === "settings" && <DoctorUpdateProfile />}
            </div>
          )}
          {activeTab === "settings" && (
            <div className="card mt-4">
              {activeTab === "settings" && <ChangePassword userType="doctor" />}
            </div>
          )}
          {activeTab === "appointments" && (
            <div className="card mt-4">
              {activeTab === "appointments" && <DoctorMyAppointments />}
            </div>
          )}
          {/* {activeTab === "patients" && (
            <div className="card mt-4">
              <DoctorMyPatients />
            </div>
          )}
          {activeTab === "patients" && (
            <div className="card mt-4">
              <SearchForPatient />
            </div>
          )} */}
          {activeTab === "patients" && (
            <div className="card mt-4">
              <CombinedDoctorMyPatientsAndSearch />
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="card mt-4">
              <TimeSlots />
            </div>
          )}
          {activeTab === "appointments" && (
            <div className="card mt-4">
              <FollowUpRequests />
            </div>
          )}
        </>
      )}
      {activeTab === "chat" && (
        <div>
          <div className="card mt-4">
            <DoctorSendsToPharm />
          </div>
          <div className="card mt-4">
            <DoctorChatsPatients />
          </div>
          <div className="card mt-4">
            <DoctorChats />
          </div>
        </div>
      )}
      {activeTab === "notifications" && (
          <div className="card mt-4">
          <NotificationsDoctor/>
        </div>
      )}
    </div>
  );
};

export default DoctorHome;
