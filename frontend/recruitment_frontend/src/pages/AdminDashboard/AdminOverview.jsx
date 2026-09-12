import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import SystemStats from "./SystemStats";
import "./AdminDashboard.css"; // Reuse existing styles

const AdminOverview = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>
        
        <SystemStats />
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
