import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/sap/user-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/login'); // redirect to login page
      } else {
        alert("❌ Signup failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className='container'>
      <div className='login'>
        <h1>Mentee Signup Form</h1>
        <form onSubmit={handleSubmit}>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter your name..'
          /><br />

          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter email..'
          /><br />

          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder='Enter password..'
          /><br />

          <label>Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='Enter password again..'
          /><br />

          <label>Enter Role: </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder='Enter Role Mentee..'
          /><br />

          <button type="submit">Sign Up</button>
        </form>

        {/* Link to Login */}
        <p style={{ marginTop: '10px' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
