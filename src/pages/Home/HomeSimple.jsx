import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './HomeSimple.css';

const HomeSimple = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    year: '',
    section: '',
    semester: '',
    academicYear: '',
    mentorName: '',
    studentEmail: localStorage.getItem('userEmail') || '',
    mentorEmail: ''
  });
  const [totalMarks, setTotalMarks] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleBasicInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalMarks = () => {
    // This would calculate total marks from all activity sections
    // For now, just return the entered value
    return totalMarks;
  };

  const handleSubmitTotalMarks = async () => {
    if (!formData.mentorEmail) {
      alert('Enter mentor email');
      return;
    }

    if (!totalMarks || totalMarks <= 0) {
      alert('Enter valid total marks');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/sap/submit-total-marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentInfo: formData,
          totalMarks: totalMarks,
          mentorEmail: formData.mentorEmail,
          email: formData.studentEmail
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Total marks submitted to mentor successfully');
        setTotalMarks(0);
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while submitting');
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
          <Link to="/events-form" className="nav-link">🎯 Detailed SAP Form</Link>
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
        {/* Header */}
        <div className="form-header">
          <h1>KONGU ENGINEERING COLLEGE, PERUNDURAI, ERODE—638060</h1>
          <h2>DEPARTMENT OF COMPUTER SCIENCE ENGINEERING</h2>
          <h3>STUDENT ACTIVITY POINTS SUMMARY</h3>
        </div>

        {/* Student Information */}
        <div className="student-info-section">
          <h4>Student Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>Student Name:</label>
              <input 
                type="text" 
                value={formData.studentName}
                onChange={(e) => handleBasicInfoChange('studentName', e.target.value)}
                placeholder="Enter student name"
              />
            </div>
            <div className="info-item">
              <label>Roll Number:</label>
              <input 
                type="text" 
                value={formData.rollNumber}
                onChange={(e) => handleBasicInfoChange('rollNumber', e.target.value)}
                placeholder="Enter roll number"
              />
            </div>
            <div className="info-item">
              <label>Year:</label>
              <input 
                type="text" 
                value={formData.year}
                onChange={(e) => handleBasicInfoChange('year', e.target.value)}
                placeholder="Enter year"
              />
            </div>
            <div className="info-item">
              <label>Section:</label>
              <input 
                type="text" 
                value={formData.section}
                onChange={(e) => handleBasicInfoChange('section', e.target.value)}
                placeholder="Enter section"
              />
            </div>
            <div className="info-item">
              <label>Semester:</label>
              <input 
                type="text" 
                value={formData.semester}
                onChange={(e) => handleBasicInfoChange('semester', e.target.value)}
                placeholder="Enter semester"
              />
            </div>
            <div className="info-item">
              <label>Academic Year:</label>
              <input 
                type="text" 
                value={formData.academicYear}
                onChange={(e) => handleBasicInfoChange('academicYear', e.target.value)}
                placeholder="Enter academic year"
              />
            </div>
            <div className="info-item">
              <label>Mentor Name:</label>
              <input 
                type="text" 
                value={formData.mentorName}
                onChange={(e) => handleBasicInfoChange('mentorName', e.target.value)}
                placeholder="Enter mentor name"
              />
            </div>
            <div className="info-item">
              <label>Student Email:</label>
              <input
                type="email"
                value={formData.studentEmail}
                onChange={(e) => handleBasicInfoChange('studentEmail', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="info-item">
              <label>Mentor Email:</label>
              <input
                type="email"
                value={formData.mentorEmail}
                onChange={(e) => handleBasicInfoChange('mentorEmail', e.target.value)}
                placeholder="mentor.email@example.com"
              />
            </div>
          </div>
        </div>

        {/* Total Marks Section */}
        <div className="total-marks-section">
          <h4>📊 Total SAP Marks Summary</h4>
          <div className="marks-card">
            <div className="marks-input-section">
              <label>Total Activity Points Earned:</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                placeholder="Enter total marks from all activities"
                className="total-marks-input"
              />
            </div>
            
            <div className="marks-info">
              <h5>📋 Activity Categories Included:</h5>
              <div className="activity-list">
                <div className="activity-item">📝 Paper Presentation</div>
                <div className="activity-item">🔬 Project Presentation</div>
                <div className="activity-item">💻 Techno Managerial Events</div>
                <div className="activity-item">🏃‍♂️ Sports & Games</div>
                <div className="activity-item">👥 Membership</div>
                <div className="activity-item">👑 Leadership/Organizing Events</div>
                <div className="activity-item">📚 VAC/Online Courses</div>
                <div className="activity-item">📄 Project to Paper/Patent/Copyright</div>
                <div className="activity-item">🎯 GATE/CAT/Govt Exams</div>
                <div className="activity-item">💼 Placement and Internship</div>
                <div className="activity-item">🚀 Entrepreneurship</div>
                <div className="activity-item">🤝 Social Activities</div>
              </div>
            </div>

            <div className="marks-reference">
              <h5>📈 Marks Reference:</h5>
              <div className="reference-table">
                <div className="ref-row">
                  <span className="ref-range">80 or More</span>
                  <span className="ref-marks">3 Marks</span>
                </div>
                <div className="ref-row">
                  <span className="ref-range">50-79</span>
                  <span className="ref-marks">2 Marks</span>
                </div>
                <div className="ref-row">
                  <span className="ref-range">20-49</span>
                  <span className="ref-marks">1 Mark</span>
                </div>
                <div className="ref-row">
                  <span className="ref-range">Below 20</span>
                  <span className="ref-marks">0 Marks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/events-form" className="detail-btn">
            📋 Fill Detailed SAP Form
          </Link>
          <button 
            type="button" 
            className="submit-btn" 
            onClick={handleSubmitTotalMarks}
            disabled={loading}
          >
            {loading ? 'Submitting...' : '📤 Submit Total Marks to Mentor'}
          </button>
        </div>

        {/* Note */}
        <div className="note-section">
          <p><strong>Note:</strong> This page allows you to submit only your total SAP marks. For detailed activity-wise submissions with proofs, use the "Detailed SAP Form" page.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeSimple;
