// src/pages/AdminDashboard/SystemStats.jsx
import React, { useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import axios from "axios";
import "./SystemStats.css";

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
          axios.get("http://127.0.0.1:8000/api/users/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/jobs/"),
          axios.get("http://127.0.0.1:8000/api/applications/", {
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
    <div className="system-stats-cards">
      <div className="stat-card">
        <div className="stat-icon-text">
          <GroupIcon className="stat-icon blue" />
          <div>
            <h4>Total Users</h4>
            <p>{stats.users}</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-text">
          <WorkOutlineIcon className="stat-icon purple" />
          <div>
            <h4>Total Jobs</h4>
            <p>{stats.jobs}</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-text">
          <AssignmentTurnedInIcon className="stat-icon green" />
          <div>
            <h4>Total Applications</h4>
            <p>{stats.applications}</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-text">
          <LeaderboardIcon className="stat-icon orange" />
          <div>
            <h4>Avg. Match Score</h4>
            <p>{stats.avgScore ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
