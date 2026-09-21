import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import AdminLayout from "../../components/Layout/AdminLayout";
import SecurityIcon from "@mui/icons-material/Security";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./ModelManager.css"; // Reuse shared card styles
import "./AdminDashboard.css";

const AdminSecurity = () => {
  const [twoFactor, setTwoFactor] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchSettingsAndLogs = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${API_BASE_URL}/api/users/settings/security/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTwoFactor(res.data.require_2fa);
        setPasswordExpiry(res.data.force_password_expiry);
        
        const logsRes = await axios.get(`${API_BASE_URL}/api/users/security/logs/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(logsRes.data);
      } catch (err) {
        console.error("Failed to load security settings or logs:", err);
      }
    };
    fetchSettingsAndLogs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`${API_BASE_URL}/api/users/settings/security/`, 
        {
          require_2fa: twoFactor,
          force_password_expiry: passwordExpiry
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Security settings updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Save security failed:", err);
      setMessage("Failed to save security settings.");
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header-modern mb-8">
          <h1 className="admin-dashboard-title-modern">Security Logs & Access</h1>
        </div>

        <div className="model-bias-wrapper-modern">
          {/* Card 1: Access Control */}
          <div className="ai-engine-card" style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div className="ai-engine-icon-wrapper indigo-bg border-indigo" style={{ alignSelf: 'center' }}>
              <VpnKeyIcon className="ai-engine-icon text-indigo" fontSize="large" />
            </div>
            
            <h2 className="ai-engine-card-title" style={{ alignSelf: 'center' }}>
              Access Control
            </h2>
            
            <div className="w-full" style={{ width: '100%' }}>
              <div className="ai-engine-detail-row">
                <div>
                  <span className="detail-label block" style={{ display: 'block', color: '#0f172a', fontWeight: '600' }}>Two-Factor Authentication</span>
                  <span className="detail-label" style={{ fontSize: '0.75rem' }}>Require 2FA for all admin accounts</span>
                </div>
                <div 
                  onClick={() => setTwoFactor(!twoFactor)}
                  style={{
                    width: '40px', height: '24px', borderRadius: '12px',
                    backgroundColor: twoFactor ? '#4f46e5' : '#cbd5e1',
                    position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                    position: 'absolute', top: '2px', left: twoFactor ? '18px' : '2px',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>

              <div className="ai-engine-detail-row">
                <div>
                  <span className="detail-label block" style={{ display: 'block', color: '#0f172a', fontWeight: '600' }}>Password Expiry</span>
                  <span className="detail-label" style={{ fontSize: '0.75rem' }}>Force password reset every 90 days</span>
                </div>
                <div 
                  onClick={() => setPasswordExpiry(!passwordExpiry)}
                  style={{
                    width: '40px', height: '24px', borderRadius: '12px',
                    backgroundColor: passwordExpiry ? '#4f46e5' : '#cbd5e1',
                    position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                    position: 'absolute', top: '2px', left: passwordExpiry ? '18px' : '2px',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button 
                className="ai-engine-btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                <SecurityIcon fontSize="small" />
                {saving ? "Saving..." : "Save Policies"}
              </button>
              {message && (
                <p className="ai-status-msg success mt-4">
                  <CheckCircleIcon fontSize="small" /> {message}
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Security Logs */}
          <div className="ai-engine-card" style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div className="ai-engine-icon-wrapper brand-bg border-brand" style={{ alignSelf: 'center' }}>
              <HistoryIcon className="ai-engine-icon text-brand" fontSize="large" />
            </div>
            
            <h2 className="ai-engine-card-title" style={{ alignSelf: 'center' }}>
              Recent Security Events
            </h2>

            <div style={{ width: '100%', overflowY: 'auto', maxHeight: '250px' }}>
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: log.status === 'error' ? '#ef4444' : '#0f172a' }}>
                      {log.event}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.user_identifier}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>{formatTime(log.created_at)}</span>
                </div>
              )) : (
                <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', marginTop: '1rem' }}>No recent events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
