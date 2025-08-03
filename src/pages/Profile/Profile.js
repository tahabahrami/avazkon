import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Settings,
  BarChart3,
  Calendar,
  Download,
  Image,
  Video,
  Clock,
  TrendingUp,
  Award,
  Bell,
  Shield,
  CreditCard,
  Edit3,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';
import SafeImage from '../../components/SafeImage';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://example.com'
  });

  // Mock data for analytics
  const usageStats = {
    totalImages: 1247,
    totalVideos: 89,
    totalDownloads: 2156,
    storageUsed: '2.4 GB',
    storageLimit: '10 GB',
    monthlyUsage: [
      { month: 'Jan', images: 45, videos: 3 },
      { month: 'Feb', images: 67, videos: 5 },
      { month: 'Mar', images: 89, videos: 8 },
      { month: 'Apr', images: 123, videos: 12 },
      { month: 'May', images: 156, videos: 15 },
      { month: 'Jun', images: 189, videos: 18 }
    ],
    modelUsage: [
      { model: 'FLUX Krea', count: 456, percentage: 45 },
      { model: 'VEO3 Fast', count: 234, percentage: 23 },
      { model: 'Image Edit', count: 345, percentage: 32 }
    ]
  };

  const recentActivity = [
    {
      id: 1,
      type: 'image_created',
      title: 'Created new image',
      description: 'Futuristic cityscape with neon lights',
      timestamp: '2 hours ago',
      model: 'FLUX Krea'
    },
    {
      id: 2,
      type: 'video_generated',
      title: 'Generated video',
      description: 'Ocean waves at sunset',
      timestamp: '5 hours ago',
      model: 'VEO3 Fast'
    },
    {
      id: 3,
      type: 'image_edited',
      title: 'Edited image',
      description: 'Enhanced portrait lighting',
      timestamp: '1 day ago',
      model: 'Image Edit'
    },
    {
      id: 4,
      type: 'bulk_download',
      title: 'Downloaded 15 assets',
      description: 'Bulk download completed',
      timestamp: '2 days ago',
      model: null
    },
    {
      id: 5,
      type: 'image_created',
      title: 'Created new image',
      description: 'Abstract geometric pattern',
      timestamp: '3 days ago',
      model: 'FLUX Krea'
    }
  ];

  const achievements = [
    { id: 1, title: 'First Creation', description: 'Created your first image', earned: true },
    { id: 2, title: 'Video Master', description: 'Generated 50 videos', earned: true },
    { id: 3, title: 'Prolific Creator', description: 'Created 1000+ images', earned: true },
    { id: 4, title: 'Early Adopter', description: 'Joined in the first month', earned: false },
    { id: 5, title: 'Power User', description: 'Used all available models', earned: true },
    { id: 6, title: 'Consistency King', description: 'Created content for 30 days straight', earned: false }
  ];

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'image_created':
        return <Image className="icon" />;
      case 'video_generated':
        return <Video className="icon" />;
      case 'image_edited':
        return <Edit3 className="icon" />;
      case 'bulk_download':
        return <Download className="icon" />;
      default:
        return <Clock className="icon" />;
    }
  };

  const renderOverview = () => (
    <div className="overview-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon images">
            <Image className="icon" />
          </div>
          <div className="stat-content">
            <h3>{usageStats.totalImages.toLocaleString()}</h3>
            <p>Images Created</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon videos">
            <Video className="icon" />
          </div>
          <div className="stat-content">
            <h3>{usageStats.totalVideos}</h3>
            <p>Videos Generated</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon downloads">
            <Download className="icon" />
          </div>
          <div className="stat-content">
            <h3>{usageStats.totalDownloads.toLocaleString()}</h3>
            <p>Total Downloads</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon storage">
            <BarChart3 className="icon" />
          </div>
          <div className="stat-content">
            <h3>{usageStats.storageUsed}</h3>
            <p>Storage Used</p>
            <div className="storage-bar">
              <div className="storage-fill" style={{ width: '24%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Usage Chart */}
      <div className="chart-section">
        <h3>Monthly Usage</h3>
        <div className="chart-container">
          <div className="chart">
            {usageStats.monthlyUsage.map((month, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-group">
                  <div 
                    className="bar images" 
                    style={{ height: `${(month.images / 200) * 100}%` }}
                  ></div>
                  <div 
                    className="bar videos" 
                    style={{ height: `${(month.videos / 20) * 100}%` }}
                  ></div>
                </div>
                <span className="month-label">{month.month}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color images"></div>
              <span>Images</span>
            </div>
            <div className="legend-item">
              <div className="legend-color videos"></div>
              <span>Videos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Usage */}
      <div className="model-usage-section">
        <h3>Model Usage Distribution</h3>
        <div className="model-list">
          {usageStats.modelUsage.map((model, index) => (
            <div key={index} className="model-item">
              <div className="model-info">
                <span className="model-name">{model.model}</span>
                <span className="model-count">{model.count} uses</span>
              </div>
              <div className="model-bar">
                <div 
                  className="model-fill" 
                  style={{ width: `${model.percentage}%` }}
                ></div>
              </div>
              <span className="model-percentage">{model.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="activity-content">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <p>Your latest actions and creations</p>
      </div>
      <div className="activity-timeline">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <h4>{activity.title}</h4>
              <p>{activity.description}</p>
              <div className="activity-meta">
                <span className="timestamp">{activity.timestamp}</span>
                {activity.model && (
                  <span className="model-badge">{activity.model}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="achievements-content">
      <div className="achievements-header">
        <h3>Achievements</h3>
        <p>Your milestones and accomplishments</p>
      </div>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
            <div className="achievement-icon">
              <Award className="icon" />
            </div>
            <div className="achievement-content">
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
            </div>
            {achievement.earned && (
              <div className="earned-badge">
                <Award className="badge-icon" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Account Settings</h3>
        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-icon">
              <Bell className="icon" />
            </div>
            <div className="setting-content">
              <h4>Notifications</h4>
              <p>Manage your notification preferences</p>
            </div>
            <button className="setting-action">Configure</button>
          </div>
          <div className="setting-item">
            <div className="setting-icon">
              <Shield className="icon" />
            </div>
            <div className="setting-content">
              <h4>Privacy & Security</h4>
              <p>Control your privacy and security settings</p>
            </div>
            <button className="setting-action">Manage</button>
          </div>
          <div className="setting-item">
            <div className="setting-icon">
              <CreditCard className="icon" />
            </div>
            <div className="setting-content">
              <h4>Billing & Subscription</h4>
              <p>View and manage your subscription</p>
            </div>
            <button className="setting-action">View</button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="settings-group">
          <div className="preference-item">
            <label>Default Image Quality</label>
            <select>
              <option>High (1024x1024)</option>
              <option>Medium (768x768)</option>
              <option>Low (512x512)</option>
            </select>
          </div>
          <div className="preference-item">
            <label>Auto-save Results</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="preference-item">
            <label>Email Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="preference-item">
            <label>Dark Mode</label>
            <input type="checkbox" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <User className="icon" />
          </div>
          <div className="header-text">
            <h1>Profile</h1>
            <p>Manage your account and view your statistics</p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar">
              <SafeImage src={user?.avatar} alt={user?.name} />
              <button className="avatar-edit">
                <Camera className="icon" />
              </button>
            </div>
            <div className="profile-info">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="Email"
                  />
                  <div className="form-actions">
                    <button type="submit" className="save-btn">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h2>{user?.name}</h2>
                  <p className="email">{user?.email}</p>
                  <div className="profile-details">
                    <div className="detail-item">
                      <Phone className="icon" />
                      <span>{editForm.phone}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin className="icon" />
                      <span>{editForm.location}</span>
                    </div>
                    <div className="detail-item">
                      <Globe className="icon" />
                      <span>{editForm.website}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
              <Edit3 className="icon" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 className="icon" />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Clock className="icon" />
          Activity
        </button>
        <button 
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Award className="icon" />
          Achievements
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="icon" />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'activity' && renderActivity()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default Profile;