import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(0);

  const incrementNotifications = () => {
    setNotifications((prevNotifications) => prevNotifications + 1);
  };

  



  return (
    <NotificationContext.Provider value={{ notifications, incrementNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
