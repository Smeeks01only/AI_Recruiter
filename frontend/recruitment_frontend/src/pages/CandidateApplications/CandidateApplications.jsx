import React, { useEffect, useState } from "react";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CandidatesNavbar from "../../components/Navbar/CandidatesNavbar";
import "./CandidateApplications.css";
import API_BASE_URL from "../../config";

const CandidateApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${API_BASE_URL}/api/applications/my-applications/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data);
      } catch (err) {
        console.error("Error loading applications:", err);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="candidate_applications_container">
      <CandidatesNavbar />
      <div className="candidate-applications">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowBackIcon fontSize="small" /> Back
          </button>
          <h1 style={{ margin: 0 }}>Your Applications</h1>
        </div>
        {applications.length === 0 && (
          <p>You haven’t applied to any jobs yet.</p>
        )}
        {applications.map((app) => (
          <div key={app.id} className="application-card">
            <h2>{app.job_title}</h2>
            <p>
              <strong>Status:</strong> {app.status}
            </p>
            {/* <p>
              <strong>Score:</strong> {app.score}
            </p> */}
            <p>
              <strong>Match Score:</strong> {app.ai_score}
            </p>
            {/* <p>
              <strong>Feedback:</strong> {app.explanation}
            </p> */}
            <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateApplications;
