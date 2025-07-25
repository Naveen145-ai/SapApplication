import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    activity: '',
    file: null, // always store file here
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Make sure file always goes to 'file' in state
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
  data.append('proof', formData.file);

  try {
    const response = await fetch('http://localhost:8080/api/sap/submit', {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    console.log('Upload result:', result);

    if (response.ok) {
      alert('✅ SAP Form submitted successfully!');
      // Optional: clear the form after success
      setFormData({
        name: '',
        email: '',
        activity: '',
        file: null,
      });
    } else {
      alert(`❌ Submission failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('❌ Something went wrong while submitting the form.');
  }
};

  return (
    <div className="sap-upload-container p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">📥 Submit SAP Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-box"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-box"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Activity Description</label>
          <textarea
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            className="input-box"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Upload Proof (PDF/Image)</label>
          <input
            type="file"
            name="proof"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className="input-box-file"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default Home;
