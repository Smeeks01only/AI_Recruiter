import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import AdminLayout from "../../components/Layout/AdminLayout";
import SettingsIcon from "@mui/icons-material/Settings";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./ModelManager.css"; // Reuse shared card styles
import "./AdminDashboard.css";

const AdminSettings = () => {
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [msgGeneral, setMsgGeneral] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [settings, setSettings] = useState({
    platform_name: "AI Recruit",
    default_language: "English (US)",
    timezone: "UTC (Coordinated Universal Time)",
    smtp_server: "smtp.mailgun.org",
    smtp_port: 587,
    smtp_encryption: "TLS",
    from_email_address: "noreply@airecruit.com"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_BASE_URL}/api/users/settings/platform/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSettings(res.data);
      } catch (err) {
        console.error("Failed to load platform settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveGeneral = async () => {
    setSavingGeneral(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`${API_BASE_URL}/api/users/settings/platform/`, 
        {
          platform_name: settings.platform_name,
          default_language: settings.default_language,
          timezone: settings.timezone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgGeneral("General preferences saved.");
      setTimeout(() => setMsgGeneral(""), 3000);
    } catch (err) {
      console.error("Save general settings failed:", err);
      setMsgGeneral("Failed to save.");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSaveEmail = async () => {
    setSavingEmail(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`${API_BASE_URL}/api/users/settings/platform/`, 
        {
          smtp_server: settings.smtp_server,
          smtp_port: settings.smtp_port,
          smtp_encryption: settings.smtp_encryption,
          from_email_address: settings.from_email_address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgEmail("Email configuration saved.");
      setTimeout(() => setMsgEmail(""), 3000);
    } catch (err) {
      console.error("Save email config failed:", err);
      setMsgEmail("Failed to save.");
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header-modern mb-8">
          <h1 className="admin-dashboard-title-modern">Platform Settings</h1>
        </div>

        <div className="model-bias-wrapper-modern">
          {/* Card 1: General Preferences */}
          <div className="ai-engine-card" style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div className="ai-engine-icon-wrapper brand-bg border-brand" style={{ alignSelf: 'center' }}>
              <LanguageIcon className="ai-engine-icon text-brand" fontSize="large" />
            </div>
            
            <h2 className="ai-engine-card-title" style={{ alignSelf: 'center' }}>
              General Preferences
            </h2>
            
            <div className="w-full" style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>Platform Name</label>
                  <input 
                    type="text" 
                    name="platform_name"
                    value={settings.platform_name || ""} 
                    onChange={handleChange}
                    style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.875rem', color: '#334155' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>Default Language</label>
                  <select 
                    name="default_language"
                    value={settings.default_language || ""} 
                    onChange={handleChange}
                    style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.875rem', color: '#334155' }}>
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>Timezone</label>
                  <select 
                    name="timezone"
                    value={settings.timezone || ""} 
                    onChange={handleChange}
                    style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.875rem', color: '#334155' }}>
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                    <option>CET (Central European Time)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button 
                className="ai-engine-btn btn-primary"
                onClick={handleSaveGeneral}
                disabled={savingGeneral}
              >
                <SettingsIcon fontSize="small" />
                {savingGeneral ? "Saving..." : "Save Preferences"}
              </button>
              {msgGeneral && (
                <p className="ai-status-msg success mt-4">
                  <CheckCircleIcon fontSize="small" /> {msgGeneral}
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Email Configuration */}
          <div className="ai-engine-card" style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div className="ai-engine-icon-wrapper indigo-bg border-indigo" style={{ alignSelf: 'center' }}>
              <EmailIcon className="ai-engine-icon text-indigo" fontSize="large" />
            </div>
            
            <h2 className="ai-engine-card-title" style={{ alignSelf: 'center' }}>
              Email Configuration
            </h2>

            <div className="w-full" style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>SMTP Server</label>
                  <input 
                    type="text" 
                    name="smtp_server"
                    value={settings.smtp_server || ""} 
                    onChange={handleChange}
                    style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.875rem', color: '#334155' }} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>SMTP Port</label>
                    <input 
                      type="number" 
                      name="smtp_port"
                      value={settings.smtp_port || 587} 
                      onChange={handleChange}
                      style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.875rem', color: '#334155' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>Encryption</label>
                    <select 
                      name="smtp_encryption"
                      value={settings.smtp_encryption || ""} 
                      onChange={handleChange}
                      style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.875rem', color: '#334155' }}>
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>From Email Address</label>
                  <input 
                    type="email" 
                    name="from_email_address"
                    value={settings.from_email_address || ""} 
                    onChange={handleChange}
                    style={{ padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.875rem', color: '#334155' }} 
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button 
                className="ai-engine-btn btn-outline"
                onClick={handleSaveEmail}
                disabled={savingEmail}
              >
                <EmailIcon fontSize="small" />
                {savingEmail ? "Saving..." : "Save Email Config"}
              </button>
              {msgEmail && (
                <p className="ai-status-msg success mt-4">
                  <CheckCircleIcon fontSize="small" /> {msgEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
