// ChatNavbar.js
//i
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import DoctorChatsPatients from './DoctorChatsPatients';
import DoctorChats from './DoctorChats';
import DoctorSendsToPharm from './DoctorSendsToPharm';


function ChatNavbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [showHistoryChats, setShowHistoryChats] = useState(false);
  const [showPharm_DocChats, setShowPharm_DocChats] = useState(false);
  const [showChatwithPatientChats, setShowChatwithPatientChats] = useState(false);




  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  
  const handleHistoryClick = () => {
    // Toggle the state for "Chat History"
    setShowHistoryChats(!showHistoryChats);
    // Call the parent component's function
   // onChatButtonClick("History");
  };

  const handlePharm_DocClick = () => {
    // Toggle the state for "Chat History"
    setShowPharm_DocChats(!showPharm_DocChats);
    // Call the parent component's function
    //onChatButtonClick("StartChatwithaDoctor");
  };

  const handleChatDoctorClick = () => {
    // Toggle the state for "Chat History"
    setShowChatwithPatientChats(!showChatwithPatientChats);
    // Call the parent component's function
    //onChatButtonClick("ChatWithaDoctor");
  };
  
  return (
    <nav className="bg-body-tertiary mb-3 flex-column navbar navbar-light">
      <Container fluid>
        <button
          aria-controls="offcanvasNavbar"
          type="button"
          aria-label="Toggle navigation"
          className="navbar-toggler collapsed"
          onClick={handleToggleOffcanvas}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Navbar.Brand href="#">Chats</Navbar.Brand>
        <Offcanvas
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          placement="end"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Choose Your Chat</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex flex-column">
             
              <Button type="button" variant="outline-secondary" className="mb-2" onClick={() => handlePharm_DocClick("StartChatwithaDoctor")}>
                Start Chat with a Pharmacist
              </Button>
              <Button type="button" variant="outline-info" className="mb-2"  onClick={() => handleChatDoctorClick("ChatWithaDoctor")}>
                Chat With a Patient
              </Button>
              <Button type="button" variant="outline-danger" className="mb-2" onClick={() => handleHistoryClick("History")}>
                Chat History
              </Button>
              <div>
              {showHistoryChats && <DoctorChats />}
              </div>
              <div>
              {showPharm_DocChats && <DoctorSendsToPharm />}
              </div>
              <div>
              {showChatwithPatientChats && <DoctorChatsPatients />}
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </nav>
  );
}

export default ChatNavbar;
