import React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import { Link, NavLink } from "react-router-dom";
import LogoutButton from "../Logout/LogoutButton";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  return (
    <header className="header">
      <Link
        to="/admin/dashboard"
        className="logo"
        style={{ textDecoration: "none" }}
      >
        <ChangeHistoryIcon style={{ color: "#4a6bff", fontSize: "2rem" }} />
        <span>AI<span className="logo-accent"> Recruit</span></span>
      </Link>

      <div className="header-controls">
        <div className="notification-container">
          <NotificationsNoneIcon className="notification-icon" />
          <span className="notification-badge">3</span>{" "}
          {/* optional/fake for now */}
        </div>
        <div className="admin-navbar-nav">
          <NavLink to="/admin/profile" className="admin-nav-link">
            <AccountCircleIcon style={{ color: "#4a5568" }} />
            <span>Profile</span>
            <KeyboardArrowDownIcon fontSize="small" />
          </NavLink>
          <span className="logout-wrapper">
            <LogoutButton />
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
