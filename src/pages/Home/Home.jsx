import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
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

  const handleBasicInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Serialize all inputs from each .activity-section into a lightweight structure
  const collectTableData = () => {
    const sections = Array.from(document.querySelectorAll('.activity-section'));
    const payload = sections.map((section, sectionIndex) => {
      const title = section.querySelector('h4')?.innerText || `Section ${sectionIndex + 1}`;
      const inputs = Array.from(section.querySelectorAll('input'));
      const values = inputs.map((input, idx) => ({ index: idx, placeholder: input.getAttribute('placeholder') || '', value: input.value }));
      return { section: title, values };
    });
    return payload;
  };

  const handleSubmitFullForm = async () => {
    if (!formData.mentorEmail) {
      alert('Enter mentor email');
      return;
    }
    const tableData = collectTableData();
    const studentInfo = {
      studentName: formData.studentName,
      rollNumber: formData.rollNumber,
      year: formData.year,
      section: formData.section,
      semester: formData.semester,
      academicYear: formData.academicYear,
      mentorName: formData.mentorName,
      studentEmail: formData.studentEmail,
      mentorEmail: formData.mentorEmail
    };

    try {
      const res = await fetch('http://localhost:8080/api/sap/submit-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentInfo, tableData, mentorEmail: formData.mentorEmail, email: formData.studentEmail })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Submitted to mentor successfully');
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while submitting');
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
          <Link to="/home" className="nav-link active">📋 SAP Form</Link>
          <Link to="/notification" className="nav-link">🔔 Notifications</Link>
        </div>
      </nav>

      <div className="form-wrapper">
        {/* Header */}
        <div className="form-header">
          <h1>KONGU ENGINEERING COLLEGE, PERUNDURAI, ERODE—638060</h1>
          <h2>DEPARTMENT OF COMPUTER SCIENCE ENGINEERING</h2>
          <h3>STUDENT ACTIVITY POINTS INDEX</h3>
        </div>

        {/* Submission Controls */}
        <div className="student-info-section">
          <h4>Delivery</h4>
          <div className="info-grid">
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
              <label>Mentor Email (must match a registered mentor):</label>
              <input
                type="email"
                value={formData.mentorEmail}
                onChange={(e) => handleBasicInfoChange('mentorEmail', e.target.value)}
                placeholder="mentor.email@example.com"
              />
            </div>
            <div className="info-item">
              <label>Action</label>
              <button type="button" className="submit-btn" onClick={handleSubmitFullForm}>Submit to Mentor</button>
            </div>
          </div>
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
          </div>
        </div>

        {/* Reference Table */}
        <div className="reference-section">
          <h4>Reference:</h4>
          <div className="reference-table">
            <table>
              <thead>
                <tr>
                  <th>Activity points earned in a semester</th>
                  <th>BE/BTech and MSc</th>
                  <th>80 or More</th>
                  <th>50-79</th>
                  <th>20-49</th>
                  <th>Below 20</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Marks earned per course in the semester</td>
                  <td></td>
                  <td>3</td>
                  <td>2</td>
                  <td>1</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Categories Count */}
        <div className="activity-count-section">
          <h4>Activity Categories Count</h4>
          <div className="count-table">
            <table>
              <thead>
                <tr>
                  <th>Professional Societies</th>
                  <th>Clubs and Associations</th>
                  <th>Sports</th>
                  <th>Others</th>
                  <th>Outside Institution Events</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 1. Paper Presentation */}
        <div className="activity-section">
          <h4>1. Paper Presentation</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Activity</th>
                  <th colSpan="3">Presented</th>
                  <th colSpan="3">Prize</th>
                  <th rowSpan="2">Max Points</th>
                </tr>
                <tr>
                  <th>Inside</th>
                  <th>Outside</th>
                  <th>Premier</th>
                  <th>Inside</th>
                  <th>Outside</th>
                  <th>Premier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Paper Presentation</td>
                  <td>2</td>
                  <td>5</td>
                  <td>10</td>
                  <td>20</td>
                  <td>30</td>
                  <td>50</td>
                  <td>75</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Project Presentation */}
        <div className="activity-section">
          <h4>2. Project Presentation</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Activity</th>
                  <th colSpan="3">Presented</th>
                  <th colSpan="3">Prize</th>
                  <th rowSpan="2">Max Points</th>
                </tr>
                <tr>
                  <th>Inside</th>
                  <th>Outside</th>
                  <th>Premier</th>
                  <th>Inside</th>
                  <th>Outside</th>
                  <th>Premier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2. Project Presentation</td>
                  <td>5</td>
                  <td>10</td>
                  <td>20</td>
                  <td>20</td>
                  <td>30</td>
                  <td>50</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Techno Managerial Events */}
        <div className="activity-section">
          <h4>3. Techno Managerial Events*</h4>
          <p className="footnote">*Priority to offline events</p>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Activity</th>
                  <th colSpan="4">Participated</th>
                  <th colSpan="4">Prizes</th>
                  <th rowSpan="2">Max Points</th>
                </tr>
                <tr>
                  <th>Inside</th>
                  <th>Outside</th>
                  <th>State</th>
                  <th>National/International</th>
                  <th>Inside</th>
                  <th>Outside</th>
                  <th>State</th>
                  <th>National/International</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>3. Techno Managerial Events</td>
                  <td>2</td>
                  <td>5</td>
                  <td>10</td>
                  <td>20</td>
                  <td>10</td>
                  <td>20</td>
                  <td>30</td>
                  <td>50</td>
                  <td>75</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Sports & Games */}
        <div className="activity-section">
          <h4>4. Sports & Games</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Activity</th>
                  <th colSpan="4">Participated</th>
                  <th colSpan="4">Prizes</th>
                  <th rowSpan="2">Max Points</th>
                </tr>
                <tr>
                  <th>Inside</th>
                  <th>Zone/Outside</th>
                  <th>State/Inter Zone</th>
                  <th>National/International</th>
                  <th>Inside</th>
                  <th>Zone/Outside</th>
                  <th>State/Inter Zone</th>
                  <th>National/International</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>4. Sports & Games</td>
                  <td>2</td>
                  <td>10</td>
                  <td>20</td>
                  <td>50/100</td>
                  <td>5</td>
                  <td>20</td>
                  <td>40</td>
                  <td>100</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Membership */}
        <div className="activity-section">
          <h4>5. Membership</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>NCC / NSS</th>
                  <th>Professional Society</th>
                  <th>Clubs</th>
                  <th>Max Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>5. Membership</td>
                  <td>20</td>
                  <td>5</td>
                  <td>2</td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Leadership/Organizing Events */}
        <div className="activity-section">
          <h4>6. Leadership/Organizing Events</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Chairman/Secretary/Treasurer etc.</th>
                  <th>Joint Secretary/Vice Chairman etc.</th>
                  <th>EC Member</th>
                  <th>Class Representative/Placement Coordinator/Cell Coordinator/IV or IPT Coordinator</th>
                  <th>Max Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>6. Leadership/Organizing Events</td>
                  <td>30</td>
                  <td>20</td>
                  <td>10</td>
                  <td>10</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. VAC/Online Courses */}
        <div className="activity-section">
          <h4>7. VAC/Online Courses</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Value Added Course (Non-credit courses)</th>
                  <th>Physical (Industry Collaboration)/Online Courses like NPTEL, etc.</th>
                  <th></th>
                  <th></th>
                  <th>Max Points</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th>One Credit Courses</th>
                  <th>Two Credit Courses</th>
                  <th>More than two credit courses</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>7. VAC/Online Courses</td>
                  <td>05</td>
                  <td>10</td>
                  <td>20</td>
                  <td>30</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. Project to Paper/Patent/Copyright */}
        <div className="activity-section">
          <h4>8. Project to Paper/Patent/Copyright</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Activity</th>
                  <th colSpan="2">SCI Indexed</th>
                  <th colSpan="2">WOS/Scopus Journal/Conference</th>
                  <th>Other Journal/Conference</th>
                  <th colSpan="3">Patent</th>
                  <th colSpan="2">Copyright</th>
                  <th rowSpan="2">Max Points</th>
                </tr>
                <tr>
                  <th>Submitted</th>
                  <th>Published</th>
                  <th>Submitted</th>
                  <th>Published</th>
                  <th></th>
                  <th>Applied</th>
                  <th>Published</th>
                  <th>Obtained</th>
                  <th>Applied</th>
                  <th>Published</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>8. Project to Paper/Patent/Copyright</td>
                  <td>10</td>
                  <td>50</td>
                  <td>10</td>
                  <td>30</td>
                  <td>5</td>
                  <td>10</td>
                  <td>20</td>
                  <td>100</td>
                  <td>05</td>
                  <td>10</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 9. GATE/CAT/Govt Exams */}
        <div className="activity-section">
          <h4>9. GATE/CAT/Govt Exams</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Appeared</th>
                  <th>Qualified in GATE/CAT etc.</th>
                  <th>Good National ranking in GATE/CAT etc.</th>
                  <th>Cleared Govt Exams</th>
                  <th>Max Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>9. GATE/CAT/Govt Exams</td>
                  <td>5</td>
                  <td>30</td>
                  <td>100</td>
                  <td>100</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 10. Placement and Internship */}
        <div className="activity-section">
          <h4>10. Placement and Internship</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Written Test cleared</th>
                  <th>Placed</th>
                  <th>Placed with Internship</th>
                  <th>Internship without Placement</th>
                  <th>Max Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10. Placement and Internship</td>
                  <td>5 (max 20)</td>
                  <td>40</td>
                  <td>50</td>
                  <td>20</td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 11. Entrepreneurship */}
        <div className="activity-section">
          <h4>11. Entrepreneurship</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Workshop attended</th>
                  <th>Registered for start-up</th>
                  <th>Released product</th>
                  <th>Max Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>11. Entrepreneurship</td>
                  <td>10</td>
                  <td>50</td>
                  <td>100</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 12. Social Activities */}
        <div className="activity-section">
          <h4>12. Social Activities</h4>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Activity</th>
                  <th colSpan="3">Community services</th>
                  <th colSpan="2">Participated</th>
                  <th colSpan="2">Prizes</th>
                  <th rowSpan="2">Max Points</th>
                </tr>
                <tr>
                  <th>Activities such as Blood donation</th>
                  <th>1 to 2 weeks (NSS/NCC Camp etc.)</th>
                  <th>More than 2 weeks</th>
                  <th>Inside</th>
                  <th>Outside</th>
                  <th>Inside</th>
                  <th>Outside</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12. Social Activities</td>
                  <td>5</td>
                  <td>30</td>
                  <td>50</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>Count</td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td><input type="number" placeholder="Count" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Student marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Mentor marks (count x marks)</td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td><input type="number" placeholder="Marks" /></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Proof page number</td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td><input type="number" placeholder="Page" /></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button type="button" className="submit-btn" onClick={handleSubmitFullForm}>Submit SAP Form</button>
        </div>

        {/* Mentor Signature */}
        <div className="signature-section">
          <div className="signature-line">
            <span>Mentor Signature:</span>
            <div className="signature-box"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
