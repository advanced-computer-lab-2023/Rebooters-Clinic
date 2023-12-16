import React, { useState, useEffect } from "react";

const NotificationsPatient = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/patient/getPatientNotifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.filteredNotifications);
          console.log(notifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications initially
    fetchNotifications();
  }, [notifications]);

  const createMarkup = (content) => {
    return { __html: content };
  };

  const hideNotification = async (notificationId) => {
    try {
      const response = await fetch("/api/patient/hideNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        // Update the UI by removing the hidden notification
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
      } else {
        console.error("Error hiding notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error hiding notification:", error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Notifications</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Recipients</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <tr key={index}>
                  <td>{notification.recipients.join(", ")}</td>
                  <td>
                    <div dangerouslySetInnerHTML={createMarkup(notification.content)} />
                  </td>
                  <td>
                    <button
                      type="button"
                      // className="btn btn-outline-danger btn-sm"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Hide Notification"
                      onClick={() => hideNotification(notification._id)}
                    >
                      &#x2716;
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No notifications available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsPatient;
