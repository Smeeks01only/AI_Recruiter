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
        <aside className="admin-sidebar-modern">
          <nav className="admin-sidebar-nav-modern">
            <NavLink to="/admin/dashboard" className="sidebar-link-modern">
              <DashboardIcon fontSize="small" /> Dashboard
            </NavLink>
            <NavLink to="/admin/users" className="sidebar-link-modern">
              <PeopleIcon fontSize="small" /> Manage Users
            </NavLink>
            <NavLink to="/admin/ai-models" className="sidebar-link-modern">
              <ModelTrainingIcon fontSize="small" /> AI Engine
            </NavLink>
            <NavLink to="/admin/security" className="sidebar-link-modern">
              <SecurityIcon fontSize="small" /> Security
            </NavLink>
            <NavLink to="/admin/settings" className="sidebar-link-modern">
              <SettingsIcon fontSize="small" /> Settings
            </NavLink>
          </nav>
        </aside>

        <main className="admin-main-content-modern">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
