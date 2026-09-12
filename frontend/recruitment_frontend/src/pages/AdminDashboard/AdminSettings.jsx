import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import SettingsIcon from "@mui/icons-material/Settings";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <h1>Platform Settings</h1>
        </div>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#64748b' }}>
          <SettingsIcon style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }} />
          <h2>Settings Coming Soon</h2>
          <p>Configure platform preferences, email servers, and global options here.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
