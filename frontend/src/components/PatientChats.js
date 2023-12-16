import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from 'react-bootstrap';
import moment from 'moment'
import "../styles/patientdoctor.css";


const PatientChats = () => {
  const [newChatContent, setNewChatContent] = useState("");
  const [messageContents, setMessageContents] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [chats, setChats] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [pollingInterval, setPollingInterval] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [expandedChats, setExpandedChats] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState('');

  const showToastMessage = (message) => {
    setToastContent(message);
    setShowToast(true);
  
    // Hide the toast after a certain duration (e.g., 3000 milliseconds)
    setTimeout(() => {
      setShowToast(false);
    }, 10000);
  };
  

  const toggleChat = (chatId) => {
    setExpandedChats((prevExpandedChats) =>
      prevExpandedChats.includes(chatId)
        ? prevExpandedChats.filter((id) => id !== chatId)
        : [...prevExpandedChats, chatId]
    );
  };

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/patient/viewMyChats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setChats(json.filter(chat=>chat.doctor==selectedDoctor));
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/patient/viewLinkedDoctors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setDoctors(json.doctors);
        
      }
    } catch (error) {
      console.error("Error fetching linked doctors:", error);
    }
  };
  useEffect(() => {
    // Fetch doctors and chats on component mount
    fetchChats();
    fetchDoctors();

    // Poll for new messages every 2 seconds
    const pollingInterval = setInterval(fetchChats, 2000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, [selectedDoctor]);
  

  const startVideoChatWithDoctor = async (doctorUsername) => {
    try {
      const response = await fetch(
        "/api/patient/createZoomMeetingNotification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doctorUsername }),
        }
      );
  
      if (response.ok) {
        showToastMessage('Check notifications tab for zoom link');
      } else {
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error("Error starting video chat:", error);
    }
  };
  
  const startNewChatWithDoctor = async () => {
    try {
      if (!newChatContent.trim()) {
        setErrorMessage("You have to type something");
        return;
      }

      const response = await fetch("/api/patient/startNewChatWithDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageContent: newChatContent,
          selectedDoctor: selectedDoctor,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        setChats([...chats, json]);
        setNewChatContent("");
        setErrorMessage("");
      } else {
        console.error("Error starting a new chat:", response.statusText);
      }
    } catch (error) {
      console.error("Error starting a new chat:", error);
    }
  };

  const continueChatWithDoctor = async (chatId) => {
    const content = messageContents[chatId] || "";
    try {
      if (!content.trim()) {
        setErrorMessage("You have to type something");
        return;
      }

      const response = await fetch("/api/patient/continueChatWithDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageContent: content }),
      });

      if (response.ok) {
        const json = await response.json();
        setChats(chats.map((chat) => (chat._id === chatId ? json : chat)));
        setMessageContents({ ...messageContents, [chatId]: "" });
        setErrorMessage("");
      } else {
        console.error("Error continuing the chat:", response.statusText);
      }
    } catch (error) {
      console.error("Error continuing the chat:", error);
    }
  };

  const deleteChatWithDoctor = async (chatId) => {
    try {
      const response = await fetch("/api/patient/deleteChatWithDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (response.ok) {
        setChats((prevChats) =>
          prevChats.filter((chat) => chat._id !== chatId)
        );
      } else {
        console.error("Error deleting chat:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };
  function showANDchat(patient){
    setSelectedDoctor(patient)
    fetchChats()
  
  }
  return (
    <div className="container">
      <div className="card">
        {/* Existing Chats */}
        {/* Start a New Chat */}
        <div>
          <h3 style={{ marginLeft: "50px",  fontSize :"20px"}}> Start a New Chat </h3>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <div className="input-group mb-3">
            {doctors.length > 0 && (
              <select
              className="form-select"
              value={selectedDoctor}
              onChange={(e) => showANDchat(e.target.value)}
            >
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
            
            )}
           
          </div>
        </div>
       {/* Assuming `chats` is an array of chat objects */}
{/* Assuming `chats` is an array of chat objects */}
{chats.map((chat) => (
  // Ensure each chat object has a `messages` array
  chat.messages && chat.messages.map((message, index) => (
    <div key={index} className={`message ${message.userType === 'patient' ? 'doctor-message-box' : 'patient-message-box'}`}>
      <div>
        <strong>{message.userType === 'patient' ? 'Me' : selectedDoctor}:</strong><br />
        {message.content}
      </div>
      <span className="text-muted timestamp">
        {moment(message.timestamp).format('MMM DD, YYYY h:mm A')}
      </span>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {/* Check if it's the last message or a message from another user */}
      {index !== chat.messages.length - 1 && message.userType !== chat.messages[index + 1].userType && (
        <div className="message-spacing"></div>
      )}
    </div>
  ))
))}

        { selectedDoctor && <div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
         
          <textarea
            rows="1"
            cols="25"
            placeholder="Type your message here..."
            value={newChatContent}
            className='type'
            onChange={(e) => setNewChatContent(e.target.value)}
          ></textarea>
          <br />
          <button className='btn btn-primary send' onClick={() =>startNewChatWithDoctor(selectedDoctor)}>
           SEND   
                    </button>
          <button className='btn btn-success video' onClick={() => startVideoChatWithDoctor(selectedDoctor)}>
            Start Video Chat
          </button>


        </div>
}
      </div>
      
      {/* Toast */}
      <div style={{ position: 'relative' }}>
      <ToastContainer position="absolute" style={{ top: '10px', right: '10px' }}  className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Header closeButton={true}>
            <strong className="me-auto">Video Chat With Doctor</strong>
          </Toast.Header>
          <Toast.Body>{toastContent}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
    </div>
  );
                }; 

export default PatientChats;
