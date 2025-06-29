import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Material UI Icons
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CandidatesNavbar from "../../components/Navbar/CandidatesNavbar";

import "./DashboardCandidate.css";

const DashboardCandidate = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API Service defined inside this file
  const fetchCandidateStats = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("⚠️ No access token found in localStorage.");
      return null;
    }

    try {
      const res = await axios.get(
        "http://localhost:8000/api/applications/my_stats/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error(
        "Error fetching stats:",
        error.response?.data || error.message
      );
      return null;
    }
  };
  

  // ✅ Fetch stats on mount
  useEffect(() => {
    fetchCandidateStats().then((data) => {
      if (data) {
        setStats(data);
      }
      setLoading(false);
    });
  }, []);

  const displayStats = [
    {
      label: "Applied Jobs",
      value: stats?.total_applied || 0,
      icon: <AssignmentOutlinedIcon className="stat-icon blue" />,
    },
    {
      label: "Shortlisted",
      value: stats?.total_shortlisted || 0,
      icon: <TrendingUpIcon className="stat-icon purple" />,
    },
    {
      label: "Rejected",
      value: stats?.total_rejected || 0,
      icon: <StarOutlineIcon className="stat-icon green" />,
    },
  ];

  return (
    <div className="dashboard-container">
      <CandidatesNavbar />

      <div className="dashboard-content">
        <div className="welcome-section">
          <div>
            <h1 className="welcome-title">Welcome back, Candidate 👋</h1>
            <p className="welcome-subtitle">
              Pick up where you left off on your job search journey.
            </p>
          </div>
          <button
            className="primary-button"
            onClick={() => navigate("/candidate/jobs")}
          >
            Browse Jobs
          </button>
        </div>

        {/* ✅ Stats Grid */}
        <div className="stats-grid">
          {loading ? (
            <p>Loading stats...</p>
          ) : (
            displayStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat_icon_container">{stat.icon}</div>
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main Actions */}
        {/* Main Actions */}
        <h2 className="section-title">Quick Actions</h2>
        <div className="action-cards">
          {/* View / Edit Profile */}
          <div
            className="action-card"
            onClick={() => navigate("/candidate/profile")}
          >
            <div className="action-card-header">
              <div className="icon-container blue">
                <PersonOutlineIcon className="action-icon" />
              </div>
              <KeyboardArrowRightIcon className="arrow-icon" />
            </div>
            <h3 className="action-title">View Your Profile</h3>
            <p className="action-description">
              Update your resume, bio, and personal details.
            </p>
          </div>

          {/* Browse Jobs (No fake matching logic) */}
          <div
            className="action-card"
            onClick={() => navigate("/candidate/jobs")}
          >
            <div className="action-card-header">
              <div className="icon-container purple">
                <WorkOutlineIcon className="action-icon" />
              </div>
              <KeyboardArrowRightIcon className="arrow-icon" />
            </div>
            <h3 className="action-title">Browse Jobs</h3>
            <p className="action-description">
              Explore all current openings posted by recruiters.
            </p>
          </div>

          {/* Application Tracker (No fake "status updates") */}
          <div
            className="action-card"
            onClick={() => navigate("/candidate/applications")}
          >
            <div className="action-card-header">
              <div className="icon-container green">
                <AssignmentOutlinedIcon className="action-icon" />
              </div>
              <KeyboardArrowRightIcon className="arrow-icon" />
            </div>
            <h3 className="action-title">Track Applications</h3>
            <p className="action-description">
              Monitor the status of jobs you’ve applied to.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCandidate;
