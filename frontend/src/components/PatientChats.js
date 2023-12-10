import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from 'react-bootstrap';



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
        setChats(json);
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
        if (json.doctors.length > 0) {
          setSelectedDoctor(json.doctors[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching linked doctors:", error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchDoctors();

    const pollingInterval = setInterval(fetchChats, 2000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

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

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginLeft: "20px" }}>My Chats</h2>
        {/* Existing Chats */}
        <div>
          {chats.map(
            (chat) =>
              !chat.closed && (
                <div key={chat._id} className="card mb-3">
                  <div
                    className="card-header d-flex justify-content-between align-items-center"
                    onClick={() => toggleChat(chat._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <h5 className="card-title">{chat.doctor}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => deleteChatWithDoctor(chat._id)}
                      aria-label="Close"
                    ></button>
                  </div>
                  {/* Check if the chat is expanded before rendering content */}
                  {expandedChats.includes(chat._id) && (
                    <>
                      <div className="card-body">
                        {chat.messages &&
                          chat.messages.map((message, index) => (
                            <div key={index}>
                              <strong>{message.userType}: </strong>{" "}
                              {message.content}
                              <span style={{ marginLeft: "10px", color: "gray" }}>
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                          ))}
                      </div>
                      <div className="card-footer">
                        {errorMessage && (
                          <p style={{ color: "red" }}>{errorMessage}</p>
                        )}
                        <div className="input-group mb-3">
                          <textarea
                            className="form-control"
                            placeholder="Type your message here..."
                            rows="1"
                            value={messageContents[chat._id] || ""}
                            onChange={(e) =>
                              setMessageContents({
                                ...messageContents,
                                [chat._id]: e.target.value,
                              })
                            }
                          ></textarea>
                          <button
                            className="btn btn-primary"
                            onClick={() => continueChatWithDoctor(chat._id)}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )
          )}
        </div>
  
        {/* Start a New Chat */}
        <div>
          <h3 style={{ marginLeft: "20px" }}> Start a New Chat </h3>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <div className="input-group mb-3">
            {doctors.length > 0 && (
              <select
                className="form-select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                {doctors.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            )}
            <textarea
              className="form-control"
              placeholder="Type your message here..."
              rows="1"
              value={newChatContent}
              onChange={(e) => setNewChatContent(e.target.value)}
            ></textarea>
            <button
              className="btn btn-primary me-2"
              onClick={startNewChatWithDoctor}
            >
              Start Chat
            </button>
            <button
              className="btn btn-primary"
              onClick={() => startVideoChatWithDoctor(selectedDoctor)}
            >
              Start Video Chat
            </button>
          </div>
        </div>
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
