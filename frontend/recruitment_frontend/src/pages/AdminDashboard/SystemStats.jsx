// src/pages/AdminDashboard/SystemStats.jsx
import React, { useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import axios from "axios";
import "./SystemStats.css";
import API_BASE_URL from "../../config";

const SystemStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    avgScore: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const [usersRes, jobsRes, appsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/users/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_BASE_URL}/api/jobs/`),
          axios.get(`${API_BASE_URL}/api/applications/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        console.log("Users:", usersRes.data);
        console.log("Jobs:", jobsRes.data);
        console.log("Applications:", appsRes.data);

        // ✅ Define these variables
        const users = usersRes.data;
        const jobs = jobsRes.data;
        const applications = appsRes.data;

        const totalApps = applications.length;
        const avgScore = totalApps
          ? (
              applications.reduce(
                (sum, app) => sum + (app.ai_score || 0),
                0
              ) / totalApps
            ).toFixed(2)
          : null;

        setStats({
          users: users.length,
          jobs: jobs.length,
          applications: totalApps,
          avgScore,
        });
      } catch (err) {
        console.error("Error fetching system stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="system-stats-grid">
      {/* Stat Card 1: Total Users */}
      <div className="stat-card-modern">
        <div className="stat-header">
          <div className="stat-icon-wrapper blue-icon">
            <GroupIcon fontSize="small" />
          </div>
          <h3 className="stat-title">Total Users</h3>
        </div>
        <p className="stat-value">{stats.users}</p>
      </div>

      {/* Stat Card 2: Total Jobs */}
      <div className="stat-card-modern">
        <div className="stat-header">
          <div className="stat-icon-wrapper purple-icon">
            <WorkOutlineIcon fontSize="small" />
          </div>
          <h3 className="stat-title">Total Jobs</h3>
        </div>
        <p className="stat-value">{stats.jobs}</p>
      </div>

      {/* Stat Card 3: Total Applications */}
      <div className="stat-card-modern">
        <div className="stat-header">
          <div className="stat-icon-wrapper green-icon">
            <AssignmentTurnedInIcon fontSize="small" />
          </div>
          <h3 className="stat-title">Total Applications</h3>
        </div>
        <p className="stat-value">{stats.applications}</p>
      </div>

      {/* Stat Card 4: Avg. Match Score */}
      <div className="stat-card-modern">
        <div className="stat-header">
          <div className="stat-icon-wrapper amber-icon">
            <LeaderboardIcon fontSize="small" />
          </div>
          <h3 className="stat-title">Avg. Match Score</h3>
        </div>
        <p className="stat-value">{stats.avgScore ?? "N/A"}</p>
      </div>
    </div>
  );
};

export default SystemStats;
