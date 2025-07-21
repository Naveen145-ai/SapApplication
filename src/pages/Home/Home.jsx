import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    category: '',
    points: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // for now just show in console
    alert("Form submitted! (console log)");
  };

  return (
    <div className="sap-upload-container p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">📥 Submit SAP Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            className="input-box"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="input-box"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-box"
            required
          >
            <option value="">Select category</option>
            <option value="Technical">Technical</option>
            <option value="Non-Technical">Non-Technical</option>
            <option value="Sports">Sports</option>
            <option value="Social">Social</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Points Claimed</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="input-box"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Upload Proof (PDF/Image)</label>
          <input
            type="file"
            name="file"
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
