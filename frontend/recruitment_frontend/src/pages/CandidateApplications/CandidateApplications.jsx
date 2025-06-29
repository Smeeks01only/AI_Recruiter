import React, { useEffect, useState } from "react";
import axios from "axios";
import CandidatesNavbar from "../../components/Navbar/CandidatesNavbar";
import "./CandidateApplications.css";

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "http://127.0.0.1:8000/api/applications/my-applications/",
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
        <h1>Your Applications</h1>
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
            <p>
              <strong>Feedback:</strong> {app.explanation}
            </p>
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
