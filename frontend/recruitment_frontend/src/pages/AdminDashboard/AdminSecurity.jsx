import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import SecurityIcon from "@mui/icons-material/Security";

const AdminSecurity = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <h1>Security Logs & Access</h1>
        </div>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#64748b' }}>
          <SecurityIcon style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }} />
          <h2>Security Settings Coming Soon</h2>
          <p>Monitor logins, audit logs, and set security policies here.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurity;
