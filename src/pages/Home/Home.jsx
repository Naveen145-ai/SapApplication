import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [userStats, setUserStats] = useState({
    totalSubmissions: 0,
    pendingApprovals: 0,
    approvedActivities: 0,
    totalPoints: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data - replace with actual API calls later
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUserStats({
        totalSubmissions: 12,
        pendingApprovals: 3,
        approvedActivities: 9,
        totalPoints: 450
      });
      
      setRecentActivities([
        { id: 1, title: 'Hackathon 2024', status: 'approved', points: 100, date: '2024-01-15' },
        { id: 2, title: 'Workshop on AI', status: 'pending', points: 50, date: '2024-01-10' },
        { id: 3, title: 'Technical Seminar', status: 'approved', points: 75, date: '2024-01-05' }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  if (isLoading) {
    return (
      <div className="home-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">SAP Dashboard</span>
        </div>
        <div className="nav-links">
          <Link to="/home" className="nav-link active">🏠 Dashboard</Link>
          <Link to="/notification" className="nav-link">🔔 Notifications</Link>
          <Link to="/profile" className="nav-link">👤 Profile</Link>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back! 👋</h1>
        <p>Track your SAP activities and manage your academic progress</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{userStats.totalSubmissions}</h3>
            <p>Total Submissions</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{userStats.pendingApprovals}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{userStats.approvedActivities}</h3>
            <p>Approved Activities</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>{userStats.totalPoints}</h3>
            <p>Total Points</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/submit-sap" className="action-btn primary">
            📤 Submit New Activity
          </Link>
          <Link to="/view-submissions" className="action-btn secondary">
            📋 View All Submissions
          </Link>
          <Link to="/guidelines" className="action-btn secondary">
            📖 View Guidelines
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <div className="section-header">
          <h2>Recent Activities</h2>
          <Link to="/all-activities" className="view-all-link">View All →</Link>
        </div>
        
        <div className="activities-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="activity-header">
                <h3>{activity.title}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(activity.status) }}
                >
                  {getStatusIcon(activity.status)} {activity.status}
                </span>
              </div>
              <div className="activity-details">
                <span className="points">🎯 {activity.points} points</span>
                <span className="date">📅 {new Date(activity.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <h2>Your Progress</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(userStats.approvedActivities / Math.max(userStats.totalSubmissions, 1)) * 100}%` }}></div>
        </div>
        <p className="progress-text">
          {userStats.approvedActivities} out of {userStats.totalSubmissions} activities approved
        </p>
      </div>
    </div>
  );
};

export default Home;
