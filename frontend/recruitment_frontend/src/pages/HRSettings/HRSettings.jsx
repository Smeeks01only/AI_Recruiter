import React, { useState, useEffect } from "react";
import axios from "axios";
import HRLayout from "../../components/Layout/HRLayout";
import "./HRSettings.css";

// Icons
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SaveIcon from "@mui/icons-material/Save";
import BusinessIcon from "@mui/icons-material/Business";
import LanguageIcon from "@mui/icons-material/Language";
import API_BASE_URL from "../../config";

const HRSettings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  // Settings State Mocks
  const [notifications, setNotifications] = useState({
    newAppAlerts: true,
    dailySummaries: true,
    aiScoring: false,
  });
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English (US)");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_BASE_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`${API_BASE_URL}/api/users/me/`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <HRLayout>
      <div className="hr-settings">
        {/* Header */}
        <div className="hr-settings-header">
          <div className="settings-title-section">
            <div className="settings-icon">
              <SettingsIcon />
            </div>
            <div className="settings-title-text">
              <h2>Settings</h2>
              <p>Manage your account, preferences, and appearance settings.</p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="settings-layout-premium">
          {/* Left Sidebar for Tabs */}
          <aside className="settings-sidebar">
            <button 
              className={`settings-tab ${activeTab === "account" ? "active" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              <PersonOutlineIcon /> Account Profile
            </button>
            <button 
              className={`settings-tab ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <NotificationsNoneIcon /> Notifications
            </button>
            <button 
              className={`settings-tab ${activeTab === "appearance" ? "active" : ""}`}
              onClick={() => setActiveTab("appearance")}
            >
              <PaletteOutlinedIcon /> Appearance
            </button>
            <button 
              className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <LockOutlinedIcon /> Security
            </button>
          </aside>

          {/* Right Content Area */}
          <div className="settings-content-area">
            {activeTab === "account" && (
              <div className="settings-panel fade-in">
                <div className="panel-header">
                  <h3>Account Profile</h3>
                  <p>Update your personal information and company details.</p>
                </div>
                
                <div className="panel-body">
                  <div className="form-group-premium">
                    <label>First Name</label>
                    <div className="input-wrapper">
                      <div className="input-icon"><PersonOutlineIcon /></div>
                      <input 
                        type="text" 
                        name="first_name"
                        value={profile.first_name || ""} 
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <div className="form-group-premium">
                    <label>Last Name</label>
                    <div className="input-wrapper">
                      <div className="input-icon"><PersonOutlineIcon /></div>
                      <input 
                        type="text" 
                        name="last_name"
                        value={profile.last_name || ""} 
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group-premium">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <div className="input-icon"><PersonOutlineIcon /></div>
                      <input type="email" value={profile.email || ""} disabled />
                    </div>
                    <small className="helper-text">Contact admin to change your email address.</small>
                  </div>

                  <div className="panel-actions">
                    <button className="btn-premium-primary" onClick={handleSaveProfile}>
                      <SaveIcon fontSize="small" style={{ marginRight: '8px' }} /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="settings-panel fade-in">
                <div className="panel-header">
                  <h3>Notification Preferences</h3>
                  <p>Choose what alerts and summaries you receive.</p>
                </div>
                
                <div className="panel-body">
                  <div className="toggle-group-premium">
                    <div className="toggle-info">
                      <h4>New Application Alerts</h4>
                      <p>Receive an email immediately when a candidate applies.</p>
                    </div>
                    <label className="premium-toggle">
                      <input 
                        type="checkbox" 
                        checked={notifications.newAppAlerts}
                        onChange={(e) => setNotifications({...notifications, newAppAlerts: e.target.checked})}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-group-premium">
                    <div className="toggle-info">
                      <h4>Daily Summaries</h4>
                      <p>A daily digest of all recruitment activity.</p>
                    </div>
                    <label className="premium-toggle">
                      <input 
                        type="checkbox" 
                        checked={notifications.dailySummaries}
                        onChange={(e) => setNotifications({...notifications, dailySummaries: e.target.checked})}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-group-premium">
                    <div className="toggle-info">
                      <h4>AI Evaluation Completed</h4>
                      <p>Get notified when the AI finishes scoring a candidate.</p>
                    </div>
                    <label className="premium-toggle">
                      <input 
                        type="checkbox" 
                        checked={notifications.aiScoring}
                        onChange={(e) => setNotifications({...notifications, aiScoring: e.target.checked})}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="panel-actions">
                    <button className="btn-premium-primary" onClick={() => alert("Notification preferences updated!")}>
                      <SaveIcon fontSize="small" style={{ marginRight: '8px' }} /> Update Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="settings-panel fade-in">
                <div className="panel-header">
                  <h3>Appearance</h3>
                  <p>Customize how AI Recruit looks on your device.</p>
                </div>
                
                <div className="panel-body">
                  <div className="theme-selector-container">
                    <div 
                      className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="theme-preview light">
                        <div className="mock-sidebar"></div>
                        <div className="mock-content"></div>
                      </div>
                      <span>Light Mode</span>
                    </div>
                    <div 
                      className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="theme-preview dark">
                        <div className="mock-sidebar"></div>
                        <div className="mock-content"></div>
                      </div>
                      <span>Dark Mode</span>
                    </div>
                  </div>

                  <hr className="divider" />

                  <div className="form-group-premium" style={{ maxWidth: '300px' }}>
                    <label>Language</label>
                    <div className="input-wrapper">
                      <div className="input-icon"><LanguageIcon /></div>
                      <select 
                        className="premium-select" 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="English (US)">English (US)</option>
                        <option value="English (UK)">English (UK)</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="settings-panel fade-in">
                <div className="panel-header">
                  <h3>Security Settings</h3>
                  <p>Manage your password and account security.</p>
                </div>
                
                <div className="panel-body">
                  <div className="form-group-premium">
                    <label>Current Password</label>
                    <div className="input-wrapper">
                      <div className="input-icon"><LockOutlinedIcon /></div>
                      <input type="password" placeholder="Enter current password" />
                    </div>
                  </div>

                  <div className="form-group-premium">
                    <label>New Password</label>
                    <div className="input-wrapper">
                      <div className="input-icon"><LockOutlinedIcon /></div>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                  </div>

                  <div className="form-group-premium">
                    <label>Confirm New Password</label>
                    <div className="input-wrapper">
                      <div className="input-icon"><LockOutlinedIcon /></div>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                  </div>

                  <div className="panel-actions">
                    <button 
                      className="btn-premium-primary"
                      onClick={() => alert("Password reset functionality requires backend email integration.")}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HRLayout>
  );
};

export default HRSettings;
