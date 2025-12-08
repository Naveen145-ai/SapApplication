import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/sap/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Fix: Use data.email and data.role directly (not nested in data.user)
        localStorage.setItem('userEmail', data.email || email);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userName', data.name || ''); // name might not be in response
        
        // Route based on role
        if (data.role === 'mentor') {
          window.location.href = 'http://localhost:3001'; // Mentor dashboard
        } else {
          navigate('/home'); // Student dashboard
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Server error: ' + (error.message || 'Unable to connect to server'));
      console.error(error);
    }
  };

  return (
    <div className='container'>
      <div className='login'>
        <h1>SAP Login Form</h1>
        <form onSubmit={handleLogin}>
          <label>Email: </label>
          <input
            type="email"
            placeholder='Enter email..'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />

          <label>Password: </label>
          <input
            type="password"
            placeholder='Enter password..'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />

          <button type="submit">Login</button>
        </form>

        {/* Link to Sign Up */}
        <p style={{ marginTop: '10px' }}>
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign Up here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
