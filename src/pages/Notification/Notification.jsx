// src/pages/Notification/Notification.jsx
import React, { useEffect, useState } from 'react';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const userEmail = localStorage.getItem('userEmail'); // Set this on login

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/sap/submissions/${userEmail}`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load notifications');
      }
    };

    if (userEmail) {
      fetchNotifications();
    }
  }, [userEmail]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No updates yet.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n._id} style={{ marginBottom: '10px' }}>
              <p><strong>Activity:</strong> {n.activity}</p>
              <p><strong>Status:</strong> {n.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
