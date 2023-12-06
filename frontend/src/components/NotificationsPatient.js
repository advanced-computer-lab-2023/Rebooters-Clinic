import React, { useState, useEffect } from 'react';

const NotificationsPatient = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetch('/api/patient/getPatientNotifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    })
      .then((response) => response.json())
      .then((data) => setNotifications(data))
      .catch((error) => console.error('Error fetching notifications:', error));
  }, []);

  const createMarkup = (content) => {
    return { __html: content };
  };

  return (
    <div className="container">
      <h2>Notifications</h2>
      <ul className="list-group">
        {notifications.map((notification, index) => (
          <li key={index} className="list-group-item">
            <strong>Recipients:</strong> {notification.recipients.join(', ')}
            <br />
            <strong>Content:</strong>{' '}
            <div dangerouslySetInnerHTML={createMarkup(notification.content)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPatient;
