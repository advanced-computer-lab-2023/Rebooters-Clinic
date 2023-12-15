
import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const DoctorSendsToPharm = () => {
  const [newChatContent, setNewChatContent] = useState('');
  const [messageContents, setMessageContents] = useState({});
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null); 
  const [Pharmacists, setPharmacists] = useState([]); 
  const [chatingWith, setChatingWith] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState('');

  useEffect(() => {
    // Fetch doctors and chats on component mount
    fetchChats();
    fetchPharmacists();

    // Poll for new messages every 2 seconds
    const pollingInterval = setInterval(fetchChats, 2000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, [chatingWith]);

  const fetchPharmacists = async () => {
    try {
      const response = await fetch("/api/doctor/viewPharmacistInformation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setPharmacists(json);
      }
    } catch (error) {
      console.error('Error fetching pharmacists:', error);
    }
  };
  const fetchChats = async () => {
    try {
      const response = await fetch("/api/doctor/viewMyChats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const json = await response.json();
        setChats(json.filter(chat=>chat.pharmacist==chatingWith));
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }

  const startNewChat = async (selectedPharmacist) => {
    try {
      
      if (!newChatContent.trim()) {
        setErrorMessage('You have to type something');
        return;
      }

      // If there's an active chat, continue it instead of starting a new one
      if (activeChat) {
        continueChat(activeChat);
        return;
      }


      const response = await fetch("/api/doctor/startNewChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageContent: newChatContent, pharmacist: selectedPharmacist})
      });

      // console.log('Response:', response);
      if (response.ok) {
        const json = await response.json();

        // console.log('json.savedChat:', json);
        // console.log('json.savedChat._id:', json._id);
          setActiveChat(json._id);
          // Refresh the chat list
          setChats([...chats, json]);
          // Clear the newChatContent and error message
          setNewChatContent('');
          setErrorMessage('');
      } else {
        // Handle error response
        console.error('Error starting a new chat:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error starting a new chat:', error);
    }
  };

  const continueChat = async (chatId) => {
    const content = messageContents[chatId] || '';
  
    try {
      if (!content.trim()) {
        setErrorMessage('You have to type something');
        return;
      }
  
      const response = await fetch("/api/doctor/continueChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, messageContent: content }),
      });
  
      if (response.ok) {
        // Refresh the chat list
        await fetchChats();
  
        // Clear the content for the specific chatId and error message
        setMessageContents({ ...messageContents, [chatId]: "" });
        setErrorMessage('');
      } else {
        console.error('Error continuing the chat:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error continuing the chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
  
      const response = await fetch(`/api/doctor/deleteChat/${chatId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Reset the active chat to null
      setActiveChat(null);
      // Refresh the chat list by filtering out the deleted chat
      setChats(chats.filter((chat) => chat._id !== chatId));


    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };
  function showANDchat(pharmacist){
    setChatingWith(pharmacist)
    fetchChats()
  
  }
  return (
    <>
   <div className="sidebar">
 
  {Pharmacists.length > 0 && (
    <div className="patientList"
    >
      {Pharmacists.map((pharmacist) => (
        <div
          key={pharmacist}
          value={pharmacist}
          className="patientName"
          onClick={() => showANDchat(pharmacist.username)}
        >
          {/* {  <img src={patient.gender && patient.gender.toLowerCase()==="male"?"https://bootdey.com/img/Content/avatar/avatar6.png":"https://bootdey.com/img/Content/avatar/avatar3.png"} alt={patient.name} className="patientImage" />   } */}
          {pharmacist.username}
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
              className={message.userType === 'pharmacist' ? 'patient-message' : 'other-message'
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

        <button className='btn btn-primary' onClick={() => continueChat(chat._id)}>
         <p  className='sendText'> Reply</p>
          
        </button>
        <br />
        <button
          style={{ marginLeft: '10px' }}
          onClick={() => deleteChat(chat._id)}
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
            <button className='btn btn-primary send' onClick={() =>startNewChat(chatingWith)}>
             SEND  
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

export default DoctorSendsToPharm;
