import React, { useState, useEffect } from 'react';
import './MarksView.css';

const MarksView = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  // Marks reference table: convert raw mentor marks to SAP points
  const marksReference = [
    { range: '0-20', points: 0 },
    { range: '21-49', points: 2 },
    { range: '50-79', points: 3 },
    { range: '80-100', points: 4 },
    { range: '101-150', points: 5 }
  ];

  // Convert raw mentor marks to SAP points based on reference table
  const convertMarksToPoints = (rawMark) => {
    const mark = Number(rawMark) || 0;
    if (mark >= 0 && mark <= 20) return 0;
    if (mark >= 21 && mark <= 49) return 2;
    if (mark >= 50 && mark <= 79) return 3;
    if (mark >= 80 && mark <= 100) return 4;
    if (mark >= 101 && mark <= 150) return 5;
    return 0;
  };

  useEffect(() => {
    // Get student email from localStorage or context
    const email = localStorage.getItem('userEmail') || '';
    setStudentEmail(email);
    if (email) {
      fetchMarksData(email);
    }
  }, []);

  const fetchMarksData = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/sap/student-marks/${email}`);
      const data = await res.json();
      
      if (res.ok) {
        setMarksData(data);
      } else {
        setError(data.message || 'Failed to fetch marks data');
      }
    } catch (err) {
      setError('Error fetching marks data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalMarks = () => {
    return marksData.reduce((total, submission) => {
      if (submission.category === 'individualEvents' && submission.events) {
        return total + submission.events.reduce((eventTotal, event) => {
          if (event.status === 'reviewed' && event.mentorMarks) {
            return eventTotal + Object.values(event.mentorMarks).reduce((sum, mark) => sum + (Number(mark) || 0), 0);
          }
          return eventTotal;
        }, 0);
      } else if (submission.status === 'accepted') {
        return total + (submission.marksAwarded || 0);
      }
      return total;
    }, 0);
  };

  if (loading) {
    return (
      <div className="marks-view-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your marks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marks-view-container">
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="marks-view-container">
      <div className="marks-header">
        <h2>📊 My SAP Marks & Feedback</h2>
        <div className="total-marks-card">
          <h3>Total SAP Points</h3>
          <div className="total-points">{calculateTotalMarks()}</div>
        </div>
      </div>

      {/* Marks Reference Table */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px solid #b3d9e8' }}>
        <h3>📋 Marks Reference Table</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
          Your mentor's evaluation marks are converted to SAP points using this reference:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Marks Range</th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>SAP Points</th>
            </tr>
          </thead>
          <tbody>
            {marksReference.map((ref, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{ref.range}</td>
                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd', fontWeight: 'bold', color: '#28a745' }}>
                  {ref.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {marksData.length === 0 ? (
        <div className="no-marks">
          <div className="no-marks-icon">📝</div>
          <h3>No submissions found</h3>
          <p>You haven't submitted any activities yet or they're still being reviewed.</p>
        </div>
      ) : (
        <div className="marks-grid">
          {marksData.map((submission, index) => (
            <div key={submission._id || index} className="submission-card">
              <div className="submission-header">
                <h4>{submission.activity || 'Individual Events'}</h4>
                <span className={`status-badge ${submission.status}`}>
                  {submission.status}
                </span>
              </div>

              {submission.category === 'individualEvents' && submission.events ? (
                <div className="events-section">
                  {submission.events.map((event, eventIdx) => (
                    <div key={eventIdx} className="event-card">
                      <div className="event-header">
                        <h5>🎯 {event.title}</h5>
                        <span className={`event-status ${event.status || 'pending'}`}>
                          {event.status || 'pending'}
                        </span>
                      </div>

                      {event.eventData && (
                        <div className="event-data">
                          <h6>Submitted Data:</h6>
                          <div className="data-grid">
                            {event.eventData.counts && Object.entries(event.eventData.counts).map(([key, value]) => (
                              <div key={`count-${key}`} className="data-item">
                                <span className="data-label">{key} (Count):</span>
                                <span className="data-value">{String(value || 0)}</span>
                              </div>
                            ))}
                            {event.eventData.studentMarks && Object.entries(event.eventData.studentMarks).map(([key, value]) => (
                              <div key={`marks-${key}`} className="data-item">
                                <span className="data-label">{key} (Student Marks):</span>
                                <span className="data-value">{String(value || 0)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.status === 'reviewed' && event.mentorMarks ? (
                        <div className="mentor-feedback">
                          <h6>Mentor Evaluation & SAP Points:</h6>
                          <div className="marks-breakdown">
                            {Object.entries(event.mentorMarks).map(([key, mark]) => {
                              const rawMark = typeof mark === 'object' ? 0 : Number(mark);
                              const sapPoints = convertMarksToPoints(rawMark);
                              return (
                                <div key={key} className="mark-item" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    <strong>{key}:</strong> {rawMark} marks → <span style={{ color: '#28a745', fontWeight: 'bold' }}>{sapPoints} pts</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="total-event-marks" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                            <strong>Total SAP Points:</strong> {Object.values(event.mentorMarks).reduce((sum, mark) => {
                              const rawMark = typeof mark === 'object' ? 0 : Number(mark);
                              return sum + convertMarksToPoints(rawMark);
                            }, 0)} points
                          </div>
                          {event.mentorNote && (
                            <div className="mentor-note" style={{ marginTop: '10px' }}>
                              <strong>Mentor Note:</strong>
                              <p>{event.mentorNote}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="pending-review">
                          <p>⏳ Awaiting mentor review</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="regular-submission">
                  <div className="submission-info">
                    <p><strong>Activity:</strong> {submission.activity}</p>
                    <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleDateString()}</p>
                  </div>

                  {submission.status === 'accepted' && (
                    <div className="mentor-feedback">
                      <h6>Mentor Evaluation:</h6>
                      <div className="marks-awarded">
                        <span>Marks Awarded: </span>
                        <span className="mark-value">{submission.marksAwarded || 0} pts</span>
                      </div>
                      {submission.decisionNote && (
                        <div className="mentor-note">
                          <strong>Mentor Note:</strong>
                          <p>{submission.decisionNote}</p>
                        </div>
                      )}
                      {submission.mentorDecisionAt && (
                        <p className="decision-date">
                          Reviewed on: {new Date(submission.mentorDecisionAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {submission.status === 'rejected' && (
                    <div className="rejection-feedback">
                      <p className="rejection-message">❌ This submission was not accepted</p>
                      {submission.decisionNote && (
                        <div className="mentor-note">
                          <strong>Reason:</strong>
                          <p>{submission.decisionNote}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {submission.status === 'pending' && (
                    <div className="pending-review">
                      <p>⏳ Your submission is under review</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarksView;
