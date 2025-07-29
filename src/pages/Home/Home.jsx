import React, { useState } from 'react';
import { Link } from 'react-router-dom';


import './Home.css'
const Home = () => {

<nav style={{ marginBottom: '20px' }}>
  <Link to="/home" style={{ marginRight: '10px' }}>Home</Link>
  <Link to="/notification">Notifications</Link>
</nav>
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    activity: '',
    mentorEmail: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'proof') {
      setFormData({ ...formData, file: files[0] });
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
      } else {
        alert('❌ ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Submission failed');
    }
  };

  return (

    <form onSubmit={handleSubmit}>

      <h1>Sap Form</h1>
      <input name="name" onChange={handleChange} placeholder="Your Name" required />
      <input name="email" onChange={handleChange} placeholder="Your Email" required />
      <input name="mentorEmail" onChange={handleChange} placeholder="Mentor Email" required />
      <textarea name="activity" onChange={handleChange} placeholder="Activity Description" required />
      <input type="file" name="proof" onChange={handleChange} required />
 
      <button type="submit">Submit SAP</button>
    </form>
  );
};

export default Home;
