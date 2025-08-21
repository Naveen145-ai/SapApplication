import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Notification.css'
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

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
    <div style={{ maxWidth: '700px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      {/* 🔙 Back to Home link */}
      <div style={{ marginBottom: '15px' }}>
        <Link to="/" style={{
          textDecoration: 'none',
          color: '#3178c6',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          ← Back to Home
        </Link>
      </div>

      <div style={{
        backgroundColor: '#e7f3fe',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #bee0fb',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#3178c6' }}>🔔 Submission Notifications</h2>
      </div>

      {notifications.length === 0 ? (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No updates yet.</p>
      ) : (
        notifications.map((n) => (
          <div key={n._id} style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '15px',
            borderLeft: `6px solid ${n.status === 'accepted' ? '#4CAF50' : n.status === 'rejected' ? '#f44336' : '#ff9800'}`
          }}>
            <p><strong>📌 Activity:</strong> {n.activity}</p>
            <p><strong>Status:</strong> <span style={{
              color: n.status === 'accepted' ? 'green' : n.status === 'rejected' ? 'red' : '#ff9800',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}>{n.status}</span></p>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
