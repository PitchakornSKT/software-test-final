import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, authAPI } from '../services/api';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        // Fetch dashboard data
        const [statsResponse, activityResponse] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentActivity()
        ]);

        setStats(statsResponse.data);
        setRecentActivity(activityResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-container">
          <h1 className="nav-logo">Dashboard</h1>
          <div className="nav-actions">
            <span className="welcome-text">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="container">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🧪</div>
              <div className="stat-info">
                <h3>{stats.totalTests || 0}</h3>
                <p>Total Tests</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.passedTests || 0}</h3>
                <p>Tests Passed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-info">
                <h3>{stats.failedTests || 0}</h3>
                <p>Tests Failed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <h3>{stats.successRate || '0%'}</h3>
                <p>Success Rate</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'test' ? '🧪' : '📝'}
                    </div>
                    <div className="activity-details">
                      <p className="activity-title">{activity.title}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                    <div className={`activity-status ${activity.status}`}>
                      {activity.status}
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-btn">
                <span className="action-icon">➕</span>
                Create New Test
              </button>
              <button className="action-btn">
                <span className="action-icon">📊</span>
                View Reports
              </button>
              <button className="action-btn">
                <span className="action-icon">👥</span>
                Manage Team
              </button>
              <button className="action-btn">
                <span className="action-icon">⚙️</span>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;