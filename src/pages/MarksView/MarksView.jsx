import React, { useState, useEffect } from 'react';
import './MarksView.css';

const MarksView = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

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
                          <h6>Mentor Evaluation:</h6>
                          <div className="marks-breakdown">
                            {Object.entries(event.mentorMarks).map(([key, mark]) => (
                              <div key={key} className="mark-item">
                                <span>{key}:</span>
                                <span className="mark-value">
                                  {typeof mark === 'object' ? JSON.stringify(mark) : String(mark)} pts
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="total-event-marks">
                            Total: {Object.values(event.mentorMarks).reduce((sum, mark) => {
                              const numMark = typeof mark === 'object' ? 0 : Number(mark);
                              return sum + (numMark || 0);
                            }, 0)} points
                          </div>
                          {event.mentorNote && (
                            <div className="mentor-note">
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
