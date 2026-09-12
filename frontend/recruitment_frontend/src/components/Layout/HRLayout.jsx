import React from "react";
import HRNavbar from "../Navbar/HRNavbar";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkIcon from "@mui/icons-material/Work";
import "./HRLayout.css";

const HRLayout = ({ children }) => {
  return (
    <div className="hr-dashboard-container">
      <HRNavbar />
      <div className="hr-layout-body">
        <aside className="hr-sidebar">
          <nav className="hr-sidebar-nav">
            <NavLink to="/hr/dashboard" className="sidebar-link">
              <DashboardIcon /> Dashboard
            </NavLink>
            <NavLink to="/hr/applications" className="sidebar-link">
              <ListAltIcon /> Applications
            </NavLink>
            <NavLink to="/hr/jobs" className="sidebar-link">
              <WorkIcon /> Jobs
            </NavLink>
            <NavLink to="/hr/profile" className="sidebar-link">
              <AccountCircleIcon /> Profile
            </NavLink>
            <NavLink to="/hr/settings" className="sidebar-link">
              <SettingsIcon /> Settings
            </NavLink>
          </nav>
        </aside>

        <main className="hr-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default HRLayout;
