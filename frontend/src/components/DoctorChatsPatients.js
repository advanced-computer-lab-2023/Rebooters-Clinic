import React, { useState, useEffect } from 'react';

const DoctorChatsPatients = () => {
  const [newChatContent, setNewChatContent] = useState('');
  const [messageContents, setMessageContents] = useState({});
  const [selectedPatient, setSelectedPatient] = useState('');
  const [chats, setChats] = useState([]);
  //const [activeChat, setActiveChat] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);
  const [patients, setPatients] = useState([]);

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
        setChats(json);
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
  }, []);

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
        // Handle success, e.g., show a success message
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


  return (
    <div className='container'>
      <h2>Chats With Patients</h2>
      <div>
        
        {/* Existing Chats */}
        <div>
  {chats.map((chat) => (
    !chat.closed && (
      <div key={chat._id}>
        <h5>My chat with: {chat.patient}</h5>
        <div>
          {chat.messages && chat.messages.map((message, index) => (
            <div key={index}>
              <strong>{message.userType}: </strong> {message.content}
              <span style={{ marginLeft: '10px', color: 'gray' }}>
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

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

        <button className='btn btn-primary' onClick={() => continueChatWithPatient(chat._id)}>
          Send
        </button>
        <br />

        <button
          className='btn btn-danger'
          style={{ marginLeft: '10px' }}
          onClick={() => deleteChatWithPatient(chat._id)}
        >
          Close Chat
        </button>
      </div>
    )
  ))}
</div>
        {/* Start a New Chat */}
          <div>
            <h3>Start a New Chat</h3>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {/* Dropdown menu for selecting patients */}
            {patients.length > 0 && (
              <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
                {patients.map((patient) => (
                  <option key={patient} value={patient}>
                    {patient}
                  </option>
                ))}
              </select>
            )}
            <textarea
              rows="1"
              cols="25"
              placeholder="Type your message here..."
              value={newChatContent}
              onChange={(e) => setNewChatContent(e.target.value)}
            ></textarea>
            <br />
            <button className='btn btn-primary' onClick={() =>startNewChatWithPatient(selectedPatient)}>
              Start Chat
            </button>
            <button className='btn btn-success' onClick={() => startVideoChatWithPatient(selectedPatient)}>
              Start Video Chat
            </button>


          </div>
      </div>
    </div>
  );
};

export default DoctorChatsPatients;
