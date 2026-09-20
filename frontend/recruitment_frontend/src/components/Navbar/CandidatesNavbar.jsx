import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LogoutButton from "../Logout/LogoutButton";
import "./CandidatesNavbar.css";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import logoUrl from "../../assets/logo.svg";
import API_BASE_URL from "../../config";

const CandidatesNavbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get(`${API_BASE_URL}/api/users/notifications/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`${API_BASE_URL}/api/users/notifications/${id}/read/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/candidate/dashboard?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="header">
      <Link
        to="/candidate/dashboard"
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
            placeholder="Search jobs..."
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="notification-container" ref={dropdownRef}>
          <div className="notification-icon-wrapper" onClick={() => setShowDropdown(!showDropdown)}>
            <NotificationsNoneIcon className="notification-icon" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </div>
          
          {showDropdown && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
              </div>
              <div className="dropdown-body">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`notification-item ${n.is_read ? 'read' : 'unread'}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <p>{n.message}</p>
                      <span className="time">{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No notifications yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="hr-navbar-nav">
          <NavLink to="/candidate/profile" className="hr-nav-link">
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

export default CandidatesNavbar;
