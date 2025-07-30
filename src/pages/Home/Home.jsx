import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    activity: '',
    mentorEmail: '',
    file: null,
  });

  const [selectedActivity, setSelectedActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');

  const activityOptions = [
    'Hackathon',
    'Workshop',
    'Seminar',
    'Internship',
    'Online Course',
    'Technical Talk',
    'Paper Presentation',
    'Project Showcase',
    'Coding Contest',
    'Tech Fest',
    'Others',
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'proof') {
      setFormData({ ...formData, file: files[0] });
    } else if (name === 'activitySelect') {
      setSelectedActivity(value);
      if (value !== 'Others') {
        setFormData({ ...formData, activity: value });
        setCustomActivity('');
      } else {
        setFormData({ ...formData, activity: '' }); // Clear activity if Others is selected
      }
    } else if (name === 'customActivity') {
      setCustomActivity(value);
      setFormData({ ...formData, activity: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('activity', formData.activity);
    data.append('mentorEmail', formData.mentorEmail);
    data.append('proof', formData.file);

    try {
      const res = await fetch('http://localhost:8080/api/sap/submit', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        alert('✅ Submitted successfully!');
        setFormData({ name: '', email: '', activity: '', mentorEmail: '', file: null });
        setSelectedActivity('');
        setCustomActivity('');
      } else {
        alert('❌ ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Submission failed');
    }
  };

  return (
    <div className="home-container">
      <nav className="nav-bar">
        <Link to="/home">🏠 Home</Link>
        <Link to="/notification">🔔 Notifications</Link>
      </nav>

      <form className="form-box" onSubmit={handleSubmit}>
        <h2>SAP Submission Form</h2>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
        <input name="mentorEmail" value={formData.mentorEmail} onChange={handleChange} placeholder="Mentor Email" required />

        {/* Dropdown + Optional input */}
        <label>Activity Type</label>
        <select name="activitySelect" value={selectedActivity} onChange={handleChange} required>
          <option value="">-- Select Activity --</option>
          {activityOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {selectedActivity === 'Others' && (
          <input
            type="text"
            name="customActivity"
            placeholder="Enter custom activity"
            value={customActivity}
            onChange={handleChange}
            required
          />
        )}

        <input type="file" name="proof" onChange={handleChange} required />
        <button type="submit">📤 Submit SAP</button>
      </form>
    </div>
  );
};

export default Home;
