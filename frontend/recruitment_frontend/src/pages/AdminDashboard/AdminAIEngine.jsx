import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import ModelManager from "./ModelManager";
import BiasAudit from "./BiasAudit";
import "./AdminDashboard.css";

const AdminAIEngine = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-header-modern mb-8">
          <h1 className="admin-dashboard-title-modern">AI Engine</h1>
        </div>
        
        <div className="model-bias-wrapper-modern">
          <ModelManager />
          <BiasAudit />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAIEngine;
