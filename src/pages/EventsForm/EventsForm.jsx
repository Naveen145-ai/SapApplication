import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EventsForm.css';

const EventsForm = () => {
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

  // State for each event's data and files
  const [eventData, setEventData] = useState({
    paperPresentation: { counts: {}, studentMarks: {}, files: [] },
    projectPresentation: { counts: {}, studentMarks: {}, files: [] },
    technoManagerial: { counts: {}, studentMarks: {}, files: [] },
    sportsGames: { counts: {}, studentMarks: {}, files: [] },
    membership: { counts: {}, studentMarks: {}, files: [] },
    leadership: { counts: {}, studentMarks: {}, files: [] },
    vacOnline: { counts: {}, studentMarks: {}, files: [] },
    projectPaper: { counts: {}, studentMarks: {}, files: [] },
    gateExams: { counts: {}, studentMarks: {}, files: [] },
    internship: { counts: {}, studentMarks: {}, files: [] },
    entrepreneurship: { counts: {}, studentMarks: {}, files: [] },
    miscellaneous: { counts: {}, studentMarks: {}, files: [] }
  });

  const [submissionStatus, setSubmissionStatus] = useState({});

  const handleBasicInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEventDataChange = (eventKey, type, field, value) => {
    setEventData(prev => ({
      ...prev,
      [eventKey]: {
        ...prev[eventKey],
        [type]: {
          ...prev[eventKey][type],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = (eventKey, files) => {
    setEventData(prev => ({
      ...prev,
      [eventKey]: {
        ...prev[eventKey],
        files: Array.from(files)
      }
    }));
  };

  const submitEventData = async (eventKey, eventTitle) => {
    if (!formData.mentorEmail) {
      alert('Please enter mentor email first');
      return;
    }

    const event = eventData[eventKey];
    if (event.files.length === 0) {
      alert(`Please upload at least one file for ${eventTitle}`);
      return;
    }

    const fd = new FormData();
    fd.append('studentInfo', JSON.stringify(formData));
    fd.append('eventKey', eventKey);
    fd.append('eventTitle', eventTitle);
    fd.append('eventData', JSON.stringify({
      counts: event.counts,
      studentMarks: event.studentMarks
    }));
    fd.append('mentorEmail', formData.mentorEmail);
    fd.append('email', formData.studentEmail);

    event.files.forEach(file => {
      fd.append(`proofs[${eventKey}]`, file);
    });

    try {
      setSubmissionStatus(prev => ({ ...prev, [eventKey]: 'submitting' }));
      
      const res = await fetch('http://localhost:8080/api/sap/submit-individual-event', {
        method: 'POST',
        body: fd
      });
      
      const data = await res.json();
      if (res.ok) {
        setSubmissionStatus(prev => ({ ...prev, [eventKey]: 'success' }));
        alert(`${eventTitle} submitted successfully!`);
      } else {
        setSubmissionStatus(prev => ({ ...prev, [eventKey]: 'error' }));
        alert(data.error || 'Submission failed');
      }
    } catch (e) {
      console.error(e);
      setSubmissionStatus(prev => ({ ...prev, [eventKey]: 'error' }));
      alert('Network error while submitting');
    }
  };

  const EventSection = ({ eventKey, title, columns, maxPoints }) => {
    const event = eventData[eventKey];
    const status = submissionStatus[eventKey];

    return (
      <div className="event-section">
        <div className="event-header">
          <h4>{title}</h4>
          <div className="event-status">
            {status === 'success' && <span className="status-success">✅ Submitted</span>}
            {status === 'submitting' && <span className="status-loading">⏳ Submitting...</span>}
            {status === 'error' && <span className="status-error">❌ Error</span>}
          </div>
        </div>
        
        <div className="event-content">
          <div className="event-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  {columns.map((col, idx) => (
                    <th key={idx}>{col.label}</th>
                  ))}
                  <th>Max Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Points</td>
                  {columns.map((col, idx) => (
                    <td key={idx}>{col.points}</td>
                  ))}
                  <td>{maxPoints}</td>
                </tr>
                <tr>
                  <td>Count</td>
                  {columns.map((col, idx) => (
                    <td key={idx}>
                      <input
                        type="number"
                        placeholder="Count"
                        min="0"
                        value={event.counts[col.key] || ''}
                        onChange={(e) => handleEventDataChange(eventKey, 'counts', col.key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td></td>
                </tr>
                <tr>
                  <td>Student Marks</td>
                  {columns.map((col, idx) => (
                    <td key={idx}>
                      <input
                        type="number"
                        placeholder="Marks"
                        min="0"
                        value={event.studentMarks[col.key] || ''}
                        onChange={(e) => handleEventDataChange(eventKey, 'studentMarks', col.key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="file-upload-section">
            <div className="upload-area">
              <label htmlFor={`files-${eventKey}`} className="upload-label">
                📎 Upload Proof Files for {title}
              </label>
              <input
                id={`files-${eventKey}`}
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(eventKey, e.target.files)}
                className="file-input"
              />
              {event.files.length > 0 && (
                <div className="file-list">
                  <p>Selected files ({event.files.length}):</p>
                  <ul>
                    {event.files.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button
              type="button"
              className={`submit-event-btn ${status === 'success' ? 'success' : ''}`}
              onClick={() => submitEventData(eventKey, title)}
              disabled={status === 'submitting' || status === 'success'}
            >
              {status === 'submitting' ? 'Submitting...' : 
               status === 'success' ? 'Submitted ✅' : 
               `Submit ${title}`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const eventConfigs = [
    {
      key: 'paperPresentation',
      title: '1. Paper Presentation',
      columns: [
        { key: 'insidePresented', label: 'Inside Presented', points: 2 },
        { key: 'outsidePresented', label: 'Outside Presented', points: 5 },
        { key: 'premierPresented', label: 'Premier Presented', points: 10 },
        { key: 'insidePrize', label: 'Inside Prize', points: 20 },
        { key: 'outsidePrize', label: 'Outside Prize', points: 30 },
        { key: 'premierPrize', label: 'Premier Prize', points: 50 }
      ],
      maxPoints: 75
    },
    {
      key: 'projectPresentation',
      title: '2. Project Presentation',
      columns: [
        { key: 'insidePresented', label: 'Inside Presented', points: 5 },
        { key: 'outsidePresented', label: 'Outside Presented', points: 10 },
        { key: 'premierPresented', label: 'Premier Presented', points: 20 },
        { key: 'insidePrize', label: 'Inside Prize', points: 20 },
        { key: 'outsidePrize', label: 'Outside Prize', points: 30 },
        { key: 'premierPrize', label: 'Premier Prize', points: 50 }
      ],
      maxPoints: 100
    },
    {
      key: 'technoManagerial',
      title: '3. Techno Managerial Events',
      columns: [
        { key: 'insideParticipated', label: 'Inside Participated', points: 2 },
        { key: 'outsideParticipated', label: 'Outside Participated', points: 5 },
        { key: 'stateParticipated', label: 'State Participated', points: 10 },
        { key: 'nationalParticipated', label: 'National/International Participated', points: 20 },
        { key: 'insidePrize', label: 'Inside Prize', points: 10 },
        { key: 'outsidePrize', label: 'Outside Prize', points: 20 },
        { key: 'statePrize', label: 'State Prize', points: 30 },
        { key: 'nationalPrize', label: 'National/International Prize', points: 50 }
      ],
      maxPoints: 75
    },
    {
      key: 'sportsGames',
      title: '4. Sports & Games',
      columns: [
        { key: 'insideParticipated', label: 'Inside Participated', points: 2 },
        { key: 'zoneParticipated', label: 'Zone/Outside Participated', points: 10 },
        { key: 'stateParticipated', label: 'State/Inter Zone Participated', points: 20 },
        { key: 'nationalParticipated', label: 'National/International Participated', points: 50 },
        { key: 'insidePrize', label: 'Inside Prize', points: 5 },
        { key: 'zonePrize', label: 'Zone/Outside Prize', points: 20 },
        { key: 'statePrize', label: 'State/Inter Zone Prize', points: 40 },
        { key: 'nationalPrize', label: 'National/International Prize', points: 100 }
      ],
      maxPoints: 100
    },
    {
      key: 'membership',
      title: '5. Membership',
      columns: [
        { key: 'nccNss', label: 'NCC / NSS', points: 20 },
        { key: 'professionalSociety', label: 'Professional Society', points: 5 },
        { key: 'clubs', label: 'Clubs', points: 2 }
      ],
      maxPoints: 50
    },
    {
      key: 'leadership',
      title: '6. Leadership/Organizing Events',
      columns: [
        { key: 'chairman', label: 'Chairman/Secretary/Treasurer etc.', points: 30 },
        { key: 'jointSecretary', label: 'Joint Secretary/Vice Chairman etc.', points: 20 },
        { key: 'ecMember', label: 'EC Member', points: 10 },
        { key: 'classRep', label: 'Class Representative/Placement Coordinator/Cell Coordinator/IV or IPT Coordinator', points: 10 }
      ],
      maxPoints: 100
    },
    {
      key: 'vacOnline',
      title: '7. VAC/Online Courses',
      columns: [
        { key: 'valueAdded', label: 'Value Added Course (Non-credit courses)', points: 5 },
        { key: 'oneCredit', label: 'One Credit Courses', points: 10 },
        { key: 'twoCredit', label: 'Two Credit Courses', points: 20 },
        { key: 'moreThanTwo', label: 'More than two credit courses', points: 30 }
      ],
      maxPoints: 100
    },
    {
      key: 'projectPaper',
      title: '8. Project to Paper/Patent/Copyright',
      columns: [
        { key: 'sciSubmitted', label: 'SCI Indexed Submitted', points: 10 },
        { key: 'sciPublished', label: 'SCI Indexed Published', points: 50 },
        { key: 'scopusSubmitted', label: 'WOS/Scopus Submitted', points: 10 },
        { key: 'scopusPublished', label: 'WOS/Scopus Published', points: 30 },
        { key: 'otherJournal', label: 'Other Journal/Conference', points: 5 },
        { key: 'patentApplied', label: 'Patent Applied', points: 10 },
        { key: 'patentPublished', label: 'Patent Published', points: 20 },
        { key: 'patentObtained', label: 'Patent Obtained', points: 100 },
        { key: 'copyrightApplied', label: 'Copyright Applied', points: 5 },
        { key: 'copyrightPublished', label: 'Copyright Published', points: 10 }
      ],
      maxPoints: 100
    },
    {
      key: 'gateExams',
      title: '9. GATE/CAT/Govt Exams',
      columns: [
        { key: 'appeared', label: 'Appeared', points: 5 },
        { key: 'qualified', label: 'Qualified in GATE/CAT etc.', points: 20 },
        { key: 'goodRanking', label: 'Good National ranking in GATE/CAT etc.', points: 30 },
        { key: 'clearedGovt', label: 'Cleared Govt Exams', points: 50 }
      ],
      maxPoints: 75
    },
    {
      key: 'internship',
      title: '10. Internship',
      columns: [
        { key: 'industryInternship', label: 'Industry Internship', points: 10 },
        { key: 'researchInternship', label: 'Research Internship', points: 15 },
        { key: 'internationalInternship', label: 'International Internship', points: 25 }
      ],
      maxPoints: 50
    },
    {
      key: 'entrepreneurship',
      title: '11. Entrepreneurship',
      columns: [
        { key: 'startupRegistered', label: 'Startup Registered', points: 30 },
        { key: 'businessPlan', label: 'Business Plan Competition', points: 10 },
        { key: 'incubation', label: 'Incubation Program', points: 20 }
      ],
      maxPoints: 60
    },
    {
      key: 'miscellaneous',
      title: '12. Miscellaneous Activities',
      columns: [
        { key: 'volunteerWork', label: 'Volunteer Work', points: 5 },
        { key: 'socialService', label: 'Social Service', points: 10 },
        { key: 'culturalEvents', label: 'Cultural Events', points: 5 },
        { key: 'otherActivities', label: 'Other Activities', points: 5 }
      ],
      maxPoints: 25
    }
  ];

  return (
    <div className="events-form-container">
      <nav className="nav-bar">
        <div className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">SAP Events Form - Kongu Engineering College</span>
        </div>
        <div className="nav-links">
          <Link to="/home" className="nav-link">📋 SAP Summary</Link>
          <Link to="/events-form" className="nav-link active">🎯 Detailed SAP Form</Link>
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
          <h3>STUDENT ACTIVITY POINTS - EVENTS SUBMISSION</h3>
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
          </div>
        </div>

        {/* Events Sections */}
        <div className="events-container">
          {eventConfigs.map((config) => (
            <EventSection
              key={config.key}
              eventKey={config.key}
              title={config.title}
              columns={config.columns}
              maxPoints={config.maxPoints}
            />
          ))}
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <h4>📊 Submission Summary</h4>
          <div className="summary-grid">
            {eventConfigs.map((config) => {
              const status = submissionStatus[config.key];
              return (
                <div key={config.key} className={`summary-item ${status || 'pending'}`}>
                  <span className="event-name">{config.title}</span>
                  <span className="event-status">
                    {status === 'success' ? '✅' : 
                     status === 'submitting' ? '⏳' : 
                     status === 'error' ? '❌' : '⏸️'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsForm;
