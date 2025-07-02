import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import LogoutButton from "../Logout/LogoutButton";
import "./CandidatesNavbar.css";

const CandidatesNavbar = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="header">
      <Link
        to="/candidate/dashboard"
        className="logo"
        style={{ textDecoration: "none" }}
      >
        AI<span className="logo-accent"> Powered Recruitment System</span>
      </Link>

      <div className="header-controls">
        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="notification-container">
          <NotificationsNoneIcon className="notification-icon" />
          <span className="notification-badge">3</span>
        </div>
        <div className="hr-navbar-nav">
          <NavLink to="/candidate/profile" className="hr-nav-link">
            <AccountCircleIcon />
            <span>Profile</span>
          </NavLink>
          <span>
            <LogoutButton />
          </span>
        </div>
      </div>
    </header>
  );
};

export default CandidatesNavbar;
