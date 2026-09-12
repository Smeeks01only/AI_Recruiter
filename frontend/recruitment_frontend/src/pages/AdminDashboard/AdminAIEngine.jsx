import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import ModelManager from "./ModelManager";
import BiasAudit from "./BiasAudit";
import "./AdminDashboard.css";

const AdminAIEngine = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header">
          <h1>AI Engine</h1>
        </div>
        
        <div className="model-bias-wrapper">
          <ModelManager />
          <BiasAudit />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAIEngine;
