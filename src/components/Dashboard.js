import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

// ============================ ICON MAPS ============================ //
const StatsIcons = {
  totalTests: 'assessment',
  passedTests: 'check_circle',
  failedTests: 'cancel',
  successRate: 'trending_up',
  totalUsers: 'people',
  activeUsers: 'person',
};

const ActivityIcons = {
  test: 'science',
  create: 'add_circle',
  update: 'edit',
  delete: 'delete',
  default: 'notifications',
};

const StatusIcons = {
  completed: 'check_circle',
  passed: 'check_circle',
  failed: 'error',
  pending: 'schedule',
  running: 'play_circle',
};

// ============================ COMPONENT ============================ //
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', status: '' });

  // ===== เพิ่มสำหรับแก้ไขโปรไฟล์ =====
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // ------------------------- Logout ------------------------- //
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  // ------------------------- Fetch Dashboard ------------------------- //
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
          handleLogout();
          return;
        }

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setProfileForm({
            fullName: parsedUser.fullName || '',
            email: parsedUser.email || '',
            password: '',
          });
        }

        const [statsResponse, activityResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/dashboard/activity', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsResponse.data);
        setActivities(activityResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        handleLogout();
      }
    };

    fetchDashboardData();
  }, [handleLogout]);

  // ------------------------- Icon Helpers ------------------------- //
  const getActivityIcon = (activityType) =>
    ActivityIcons[activityType] || ActivityIcons.default;

  const getStatusIcon = (status) =>
    StatusIcons[status] || StatusIcons.pending;

  const getStatusClass = (status) => `activity-status ${status}`;

  // ------------------------- Edit Activity ------------------------- //
  const handleEditActivity = (activity) => {
    setEditingActivity(activity.id);
    setEditForm({ title: activity.title, status: activity.status });
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setEditForm({ title: '', status: '' });
  };

  const handleUpdateActivity = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/dashboard/activity/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.id === id ? { ...activity, ...editForm } : activity
          )
        );
        setEditingActivity(null);
        alert('✅ Activity updated successfully!');
      } else {
        alert('❌ Update failed.');
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to update activity');
    }
  };

  // ------------------------- Delete Activity ------------------------- //
  const handleDeleteActivity = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:5000/api/dashboard/activity/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setActivities((prevActivities) =>
            prevActivities.filter((activity) => activity.id !== id)
          );
          alert('🗑️ Activity deleted successfully!');
        } else {
          alert('❌ Failed to delete activity.');
        }
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity');
      }
    }
  };

  // ------------------------- Edit Profile ------------------------- //
  const handleEditProfile = () => setEditingProfile(true);

  const handleCancelProfileEdit = () => {
    setEditingProfile(false);
    setProfileForm({
      fullName: user.fullName,
      email: user.email,
      password: '',
    });
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/users/profile',
        profileForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert('✅ Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setEditingProfile(false);
      } else {
        alert('❌ Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('⚠️ Error updating profile');
    }
  };

  // ------------------------- Loading State ------------------------- //
  if (!stats) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // ------------------------- Render ------------------------- //
  return (
    <div className="dashboard">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-container">
          <h1 className="nav-logo">Dashboard</h1>
          <div className="nav-actions">
            <span className="welcome-text">
              Welcome, {user?.fullName || user?.username || 'User'}!
            </span>
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              <span className="material-icons">account_circle</span> Edit Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <span className="material-icons">logout</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ==================== Edit Profile Section ==================== */}
      {editingProfile && (
        <div className={`profile-modal-overlay ${editingProfile ? 'active' : ''}`}>
          <div className="profile-edit-container">
            <h2>Edit Profile</h2>
            <div className="profile-edit-form">
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileChange}
              />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
              />

              <label>New Password (optional):</label>
              <input
                type="password"
                name="password"
                value={profileForm.password}
                onChange={handleProfileChange}
              />

              <div className="profile-edit-buttons">
                <button className="save-btn" onClick={handleSaveProfile}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancelProfileEdit}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ==================== Dashboard Content ==================== */}
      <div className="dashboard-content">
        <div className="container">
          {/* Stats Section */}
          <div className="stats-grid">
            {[ 
              { label: 'Total Tests', value: stats.totalTests, icon: StatsIcons.totalTests },
              { label: 'Passed Tests', value: stats.passedTests, icon: StatsIcons.passedTests },
              { label: 'Failed Tests', value: stats.failedTests, icon: StatsIcons.failedTests },
              { label: 'Success Rate', value: `${stats.successRate}%`, icon: StatsIcons.successRate },
              { label: 'Total Users', value: stats.totalUsers, icon: StatsIcons.totalUsers },
              { label: 'Active Users', value: stats.activeUsers, icon: StatsIcons.activeUsers },
            ].map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <span className="material-icons">{stat.icon}</span>
                </div>
                <div className="stat-info">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <button className="refresh-btn" onClick={() => window.location.reload()}>
                <span className="material-icons">refresh</span>
                Refresh
              </button>
            </div>

            <div className="activity-list">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <span className="material-icons">{getActivityIcon(activity.type)}</span>
                    </div>

                    <div className="activity-details">
                      {editingActivity === activity.id ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                            className="edit-input"
                          />
                          <select
                            value={editForm.status}
                            onChange={(e) =>
                              setEditForm({ ...editForm, status: e.target.value })
                            }
                            className="edit-select"
                          >
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                            <option value="running">Running</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      ) : (
                        <>
                          <p className="activity-title">{activity.title}</p>
                          <span className="activity-time">{activity.time}</span>
                        </>
                      )}
                    </div>

                    <div className="activity-actions">
                      {editingActivity === activity.id ? (
                        <>
                          <button className="action-btn save-btn" onClick={() => handleUpdateActivity(activity.id)}>
                            <span className="material-icons">save</span>
                          </button>
                          <button className="action-btn cancel-btn" onClick={handleCancelEdit}>
                            <span className="material-icons">cancel</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <div className={getStatusClass(activity.status)}>
                            <span className="material-icons status-icon">
                              {getStatusIcon(activity.status)}
                            </span>
                            <span className="status-text">{activity.status}</span>
                          </div>
                          <button className="action-btn edit-btn" onClick={() => handleEditActivity(activity)}>
                            <span className="material-icons">edit</span>
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDeleteActivity(activity.id)}>
                            <span className="material-icons">delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
