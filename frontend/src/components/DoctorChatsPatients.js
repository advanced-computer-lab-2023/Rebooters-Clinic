import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import "../styles/doctor.css";

const DoctorChatsPatients = () => {
  const [newChatContent, setNewChatContent] = useState('');
  const [messageContents, setMessageContents] = useState({});
  const [selectedPatient, setSelectedPatient] = useState('');
  const [chats, setChats] = useState([]);
  //const [activeChat, setActiveChat] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [chatingWith, setChatingWith] = useState(null);

  const showToastMessage = (message) => {
    setToastContent(message);
    setShowToast(true);
  
    // Hide the toast after a certain duration (e.g., 3000 milliseconds)
    setTimeout(() => {
      setShowToast(false);
    }, 10000);
  };
  
  
  const fetchChatsWithPatients = async () => {
    try {
      
      const response = await fetch("/api/doctor/viewMyChatsWithPatients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setChats(json.filter(chat=>chat.patient===chatingWith));

      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/doctor/viewLinkedPatients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setPatients(json.patients);
        if (json.patients.length > 0) {
          // Set the default selected doctor to the first doctor in the list
          setSelectedPatient(json.patients[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching linked patients:', error);
    }
  };

  useEffect(() => {
    fetchChatsWithPatients();
    fetchPatients();


    // Poll for new messages every 2 seconds
    const pollingInterval = setInterval(fetchChatsWithPatients, 2000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, [chatingWith]);

  //console.log(patients);

  const startVideoChatWithPatient = async (patientUsername) => {
    try {
      const response = await fetch("/api/doctor/createZoomMeetingNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientUsername }),
      });
      


      if (response.ok) {
        showToastMessage('Check notifications tab for zoom link');
      } else {
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error("Error starting video chat:", error);
    }
  };


  const startNewChatWithPatient = async (patientUsername) => {
    try {
      if (!newChatContent.trim()) {
        setErrorMessage('You have to type something');
        return;
      }

      const response = await fetch("/api/doctor/startNewChatWithPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageContent: newChatContent , selectedPatient: patientUsername}),
      });
      const json = await response.json();
      // Refresh the chat list
      setChats([...chats, json]);
      // Clear the newChatContent and error message
      setNewChatContent('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error starting a new chat:', error);
    }
  };

  const continueChatWithPatient = async (chatId) => {
    const content = messageContents[chatId] || '';
    try {
      if (!content.trim()) {
        setErrorMessage('You have to type something');
        return;
      }
      const response = await fetch("/api/doctor/continueChatWithPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageContent: content}),
      });
      const json = await response.json();

      // Refresh the chat list
      setChats(chats.map((chat) => (chat._id === chatId ? json : chat)));
      // Clear the content for the specific chatId and error message
      setMessageContents({ ...messageContents, [chatId]: '' });
      setErrorMessage('');
    } catch (error) {
      console.error('Error continuing the chat:', error);
    }
  };
 

  const deleteChatWithPatient = async (chatId) => {
  try {
    const response = await fetch("/api/doctor/deleteChatWithPatient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({chatId}),
    });

    if (response.ok) {
      // Remove the closed chat from the frontend
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
    } else {
      console.error('Error deleting chat:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
};
function showANDchat(patient){
  setChatingWith(patient)
  fetchChatsWithPatients()

}

  return (
    <>
   <div className="sidebar">
  {patients.length > 0 && (
    <div className="patientList"
    >
      {patients.map((patient) => (
        <div
          key={patient}
          value={patient}
          className="patientName"
          onClick={() => showANDchat(patient)}
        >
          {/* {  <img src={patient.gender && patient.gender.toLowerCase()==="male"?"https://bootdey.com/img/Content/avatar/avatar6.png":"https://bootdey.com/img/Content/avatar/avatar3.png"} alt={patient.name} className="patientImage" />   } */}
          {patient}
        </div>
      ))}
    </div>
  )}
     </div>
     <div >
     <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '400px', marginLeft: '220px' }}>
        <div >
      

  {chatingWith && chats.map((chat) => (
    !chat.closed && (

      <div key={chat._id}>
      <div className="message-container">
        {chat.messages &&
          chat.messages.map((message, index) => (
            <div
              key={index}
              className={message.userType === 'patient' ? 'patient-message' : 'other-message'
            }
            >
              <strong>{message.userType}: </strong> <br></br>{message.content}
              <span style={{ marginLeft: '10px', color: 'gray' }}>
                {new Date(message.timestamp).toLocaleString()}
              </span>
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <textarea
          rows="1"
          cols="25"
          placeholder="Type your message here..."
          value={messageContents[chat._id] || ''}
          onChange={(e) =>
            setMessageContents({ ...messageContents, [chat._id]: e.target.value })
          }
        ></textarea>
  <div className="button-container">

        <button className='btn btn-primary' onClick={() => continueChatWithPatient(chat._id)}>
         <p  className='sendText'> Reply</p>
          
        </button>
        <br />
        <button
          style={{ marginLeft: '10px' }}
          onClick={() => deleteChatWithPatient(chat._id)}
        >
        <p>  Hide</p>
        </button>
        </div>
            </div>
          ))}
      </div>
    


       
      </div>
    )
  ))}
</div>
        {/* Start a New Chat */}
        { chatingWith && <div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {/* Dropdown menu for selecting patients */}
           
            <textarea
              rows="1"
              cols="25"
              placeholder="Type your message here..."
              value={newChatContent}
              className='type'
              onChange={(e) => setNewChatContent(e.target.value)}
            ></textarea>
            <br />
            <button className='btn btn-primary send' onClick={() =>startNewChatWithPatient(chatingWith)}>
SEND            </button>
            <button className='btn btn-success video' onClick={() => startVideoChatWithPatient(chatingWith)}>
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
            <strong className="me-auto">Video Chat With Patient</strong>
          </Toast.Header>
          <Toast.Body>{toastContent}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
    </div>
    </>
  );
};

export default DoctorChatsPatients;
