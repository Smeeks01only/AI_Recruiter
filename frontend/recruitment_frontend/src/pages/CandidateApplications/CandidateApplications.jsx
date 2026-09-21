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
      <main className="candidate-apps-main">
        {/* Page Header */}
        <div className="apps-page-header">
          <button onClick={() => navigate(-1)} className="back-btn shrink-0">
            <ArrowBackIcon fontSize="small" /> Back
          </button>
          <h1 className="apps-page-title">
            Your Applications
          </h1>
        </div>

        {/* Applications List Container */}
        <div className="app-list-wrapper">
          {applications.length === 0 && (
            <p className="no-apps-msg">You haven't applied to any jobs yet.</p>
          )}
          {applications.map((app) => (
            <article key={app.id} className="app-card-modern">
              <h2 className="app-card-title">
                {app.job_title}
              </h2>
              
              <div className="app-details">
                <p className="app-detail-item">
                  <span className="detail-label">Status:</span> {app.status}
                </p>
                <p className="app-detail-item">
                  <span className="detail-label">Match Score:</span> {app.ai_score}
                </p>
              </div>
              
              <div className="app-actions">
                <a 
                  href={app.resume_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="app-action-link"
                >
                  View Resume
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CandidateApplications;
