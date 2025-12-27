import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [sapSummary, setSapSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    setStudentEmail(email);
    if (email) {
      fetchSAPSummary(email);
    }
  }, []);

  const fetchSAPSummary = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/sap/student-marks/${email}`);
      const data = await res.json();
      if (res.ok) {
        setSapSummary(data);
      }
    } catch (err) {
      console.error('Error fetching SAP summary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sap-form-container">
      <nav className="nav-bar">
        <div className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">SAP Form - Kongu Engineering College</span>
        </div>
        <div className="nav-links">
          <Link to="/home" className="nav-link active">📋 SAP Summary</Link>
          <Link to="/events-form" className="nav-link">🎯 Individual Events</Link>
          <Link to="/marks-view" className="nav-link">📊 My Marks</Link>
          <button 
            onClick={() => {
              localStorage.removeItem('userEmail');
              window.location.href = '/login';
            }}
            className="nav-link logout-btn"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      <div className="form-wrapper">
        <div className="form-header">
          <h1>KONGU ENGINEERING COLLEGE, PERUNDURAI, ERODE—638060</h1>
          <h2>DEPARTMENT OF COMPUTER SCIENCE ENGINEERING</h2>
          <h3>STUDENT ACTIVITY POINTS - SAP SUMMARY</h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            ⏳ Loading SAP Summary...
          </div>
        ) : sapSummary.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f0f8ff', borderRadius: '8px', marginTop: '20px' }}>
            <h3>📝 No Submissions Yet</h3>
            <p>You haven't submitted any activities yet.</p>
            <Link to="/events-form" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
              ➜ Go to Individual Events Form to submit activities
            </Link>
          </div>
        ) : (
          <div className="sap-summary-section" style={{ marginTop: '30px' }}>
            <h3>📊 Your SAP Submissions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {sapSummary.map((submission, idx) => (
                <div key={submission._id || idx} style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ fontSize: '16px' }}>{submission.activity || 'Individual Events'}</strong>
                  </div>
                  
                  {submission.category === 'individualEvents' && submission.events ? (
                    <div>
                      {submission.events.map((event, eventIdx) => (
                        <div key={eventIdx} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                          <div style={{ fontWeight: 'bold', color: '#333' }}>
                            🎯 {event.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            Status: <span style={{ 
                              padding: '2px 6px', 
                              borderRadius: '3px',
                              backgroundColor: event.status === 'reviewed' ? '#d4edda' : '#fff3cd',
                              color: event.status === 'reviewed' ? '#155724' : '#856404'
                            }}>
                              {event.status || 'pending'}
                            </span>
                          </div>
                          {event.status === 'reviewed' && event.mentorMarks && (
                            <div style={{ marginTop: '8px', fontSize: '13px', color: '#28a745', fontWeight: 'bold' }}>
                              ✅ Mentor Evaluated
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Status: <span style={{ fontWeight: 'bold' }}>{submission.status}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e8f4f8', borderRadius: '8px', border: '1px solid #b3d9e8' }}>
          <h3>📌 Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/events-form" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                ➜ Submit Individual Events
              </Link>
            </li>
            <li>
              <Link to="/marks-view" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                ➜ View My Marks & Feedback
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
