// ChatNavbar.js
//i
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import PatientChats from './PatientChats';

function ChatNavbar(props) {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [showHistoryChats, setShowHistoryChats] = useState(false);




  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  
  const handleHistoryClick = () => {
    // Toggle the state for "Chat History"
    setShowHistoryChats(!showHistoryChats);
    // Call the parent component's function
   // onChatButtonClick("History");
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
            show={props.showChatNavbar}
            onHide={props.onHide}
              placement="end"
            aria-labelledby="offcanvasNavbarLabel"
          >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Choose Your Chat</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex flex-column">        
              <Button type="button" variant="outline-danger" className="mb-2" onClick={() => handleHistoryClick("History")}>
                Chat History
              </Button>
              <div>
              {showHistoryChats && <PatientChats />}
              </div>          
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </nav>
  );
}

export default ChatNavbar;
