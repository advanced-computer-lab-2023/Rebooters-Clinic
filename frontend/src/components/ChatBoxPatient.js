import React, { useState, useEffect } from 'react';
import ChatNavbar from './ChatNavbar';
import ChatNavBarPatient from './ChatNavBarPatient';
import '../styles/chatbox.css'; // Import the CSS file for styling
import chatIcon from '../styles/chatIcon.png'; // Import your chat icon image
//im
function ChatBoxPatient() {
    const [showChatNavbar, setShowChatNavbar] = useState(false);
    const [bottomPosition, setBottomPosition] = useState(20);


    const handleChatButtonClick = () => {
      setShowChatNavbar((prevShowChatNavbar) => !prevShowChatNavbar);
    };

    useEffect(() => {
      const handleScroll = () => {
        const scrolledHeight = window.scrollY;
        const newPosition = 20 + scrolledHeight; 
        setBottomPosition(newPosition);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);


    return (

      <div className={`chat-box ${showChatNavbar ? 'open' : ''}`} style={{ bottom: `${bottomPosition}px` }}>

        <img
          src={chatIcon}
          alt="Chat Icon"
          className="chat-icon"
          onClick={handleChatButtonClick}
        />
<ChatNavBarPatient showChatNavbar={showChatNavbar} onHide={() => setShowChatNavbar(false)} />

      </div>
    );
  }

  export default ChatBoxPatient;