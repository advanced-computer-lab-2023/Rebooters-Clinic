import React, { useState, useEffect } from 'react';

const PatientChats = () => {
  const [newChatContent, setNewChatContent] = useState('');
  const [messageContents, setMessageContents] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [chats, setChats] = useState([]);
  //const [activeChat, setActiveChat] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);
  const [doctors, setDoctors] = useState([]);

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
        setChats(json);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
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
        if (json.doctors.length > 0) {
          // Set the default selected doctor to the first doctor in the list
          setSelectedDoctor(json.doctors[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching linked doctors:', error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchDoctors();
    


    // Poll for new messages every 2 seconds
    const pollingInterval = setInterval(fetchChats, 2000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  console.log(doctors);


  const startVideoChatWithDoctor = async (doctorUsername) => {
    try {
      const response = await fetch("/api/patient/createZoomMeetingNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorUsername }),
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


  const startNewChatWithDoctor = async () => {
    try {
      if (!newChatContent.trim()) {
        setErrorMessage('You have to type something');
        return;
      }

      const response = await fetch("/api/patient/startNewChatWithDoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageContent: newChatContent , selectedDoctor: selectedDoctor}),
      });
      const json = await response.json();
      // Set the active chat to the newly created chat
      //setActiveChat(json._id);
      // Refresh the chat list
      setChats([...chats, json]);
      // Clear the newChatContent and error message
      setNewChatContent('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error starting a new chat:', error);
    }
  };

  const continueChatWithDoctor = async (chatId) => {
    const content = messageContents[chatId] || '';
    try {
      if (!content.trim()) {
        setErrorMessage('You have to type something');
        return;
      }
      const response = await fetch("/api/patient/continueChatWithDoctor", {
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

  const deleteChatWithDoctor = async (chatId) => {
  try {
    const response = await fetch("/api/patient/deleteChatWithDoctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({chatId}),
    });

    if (response.ok) {
      // Reset the active chat to null
      //setActiveChat(null);

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
      <h2>My Chats</h2>
      <div>
        
        {/* Existing Chats */}
        <div>
  {chats.map((chat) => (
    !chat.closed && (
      <div key={chat._id}>
        <h5>My chat with: {chat.doctor}</h5>
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

        <button className='btn btn-primary' onClick={() => continueChatWithDoctor(chat._id)}>
          Send
        </button>
        <br />

        <button
          className='btn btn-danger'
          style={{ marginLeft: '10px' }}
          onClick={() => deleteChatWithDoctor(chat._id)}
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
            {/* Dropdown menu for selecting doctors */}
            {doctors.length > 0 && (
              <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                {doctors.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
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
            <button className='btn btn-primary' onClick={startNewChatWithDoctor}>
              Start Chat
            </button>
            <button className='btn btn-success' onClick={() => startVideoChatWithDoctor(selectedDoctor)}>
              Start Video Chat
            </button>
          </div>
      </div>
    </div>
  );
};

export default PatientChats;
