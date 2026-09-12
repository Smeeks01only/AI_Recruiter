import React from "react";
import AdminNavbar from "../Navbar/AdminNavbar";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-dashboard-container">
      <AdminNavbar />
      <div className="admin-layout-body">
        <aside className="admin-sidebar">
          <nav className="admin-sidebar-nav">
            <NavLink to="/admin/dashboard" className="sidebar-link">
              <DashboardIcon /> Dashboard
            </NavLink>
            <NavLink to="/admin/users" className="sidebar-link">
              <PeopleIcon /> Manage Users
            </NavLink>
            <NavLink to="/admin/ai-models" className="sidebar-link">
              <ModelTrainingIcon /> AI Engine
            </NavLink>
            <NavLink to="/admin/security" className="sidebar-link">
              <SecurityIcon /> Security
            </NavLink>
            <NavLink to="/admin/settings" className="sidebar-link">
              <SettingsIcon /> Settings
            </NavLink>
          </nav>
        </aside>

        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
