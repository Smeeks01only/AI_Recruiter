import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logoUrl from "../../assets/logo.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LogoutButton from "../Logout/LogoutButton";
import "./HRNavbar.css";

const HRNavbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/hr/dashboard?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="header">
      <Link
        to="/hr/dashboard"
        className="logo"
        style={{ textDecoration: "none" }}
      >
        <img src={logoUrl} alt="AI Recruit Logo" style={{ width: "1.75rem", height: "1.75rem", marginRight: "0.5rem" }} />
        <span>AI Recruit</span>
      </Link>

      <div className="header-controls">
        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs, candidates, or anything..."
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="notification-container">
          <NotificationsNoneIcon className="notification-icon" />
          <span className="notification-badge">3</span>
        </div>
        <div className="hr-navbar-nav">
          <NavLink to="/hr/profile" className="hr-nav-link">
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

export default HRNavbar;
