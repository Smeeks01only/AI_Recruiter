import React, { useEffect, useState } from "react";
import axios from "axios";
import HRNavbar from "../../components/Navbar/HRNavbar";
import "./HRApplications.css";

const HRApplications = () => {
  const [groupedApplications, setGroupedApplications] = useState({});
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  function capitalizeFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/applications/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const grouped = {};
      res.data.forEach((app) => {
        if (!grouped[app.job_title]) {
          grouped[app.job_title] = [];
        }
        grouped[app.job_title].push(app);
      });

      for (let title in grouped) {
        grouped[title].sort(
          (a, b) => (b.match_score || 0) - (a.match_score || 0)
        );
      }

      setGroupedApplications(grouped);
    } catch (err) {
      console.error("Error fetching applications", err);
    }
  };

  const openModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setShowModal(true);
  };

  const updateStatus = async () => {
    if (!selectedApp) return;

    try {
      const res = await axios.patch(
        `http://127.0.0.1:8000/api/applications/${selectedApp.id}/update_status/`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Status updated!");
        setShowModal(false);
        fetchApplications(); // Refresh
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };


  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showModal]);
  
  return (
    <div className="hr-applications">
      <HRNavbar />
      <h1>Job Applications</h1>
      {Object.keys(groupedApplications).length === 0 ? (
        <p>No applications found.</p>
      ) : (
        Object.entries(groupedApplications).map(([jobTitle, apps]) => (
          <div key={jobTitle} className="job-group">
            <h2>{jobTitle}</h2>
            <div className="applications-list">
              {apps.map((app) => (
                <div
                  className="application-card"
                  key={app.id}
                  onClick={() => openModal(app)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="application-header">
                    <h4>
                      {capitalizeFirstLetter(app.applicant_first_name)}{" "}
                      {capitalizeFirstLetter(app.applicant_last_name)}
                    </h4>

                    <span
                      className={`status-badge ${app.status.toLowerCase()}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="score-section">
                    {/* <div className="score-pill">
                      Match Score: {app.match_score ?? "N/A"}
                    </div> */}
                    <div className="score-pill">
                      AI Score: {app.ai_score ?? "N/A"}
                    </div>
                  </div>

                  <p className="explanation">
                    <strong>Explanation:</strong> {app.match_explanation}
                  </p>

                  {app.resume && (
                    <a
                      href={`http://127.0.0.1:8000${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      type="application/pdf"
                    >
                      📄 View Resume
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Applicant Details</h2>

            <div className="modal-section">
              <p>
                <strong>Name:</strong> {selectedApp.applicant_first_name}{" "}
                {selectedApp.applicant_last_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedApp.applicant_email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApp.parsed_phone}
              </p>
            </div>

            <div className="modal-section">
              <p>
                <strong>Job:</strong> {selectedApp.job_title}
              </p>
              <p>
                <strong>Status:</strong> {selectedApp.status}
              </p>
              {/* <p>
                <strong>Match Score:</strong> {selectedApp.match_score ?? "N/A"}
              </p> */}
              <p>
                <strong>AI Score:</strong> {selectedApp.ai_score ?? "N/A"}
              </p>
            </div>

            <div className="modal-section">
              <p>
                <strong>Explanation:</strong> {selectedApp.match_explanation}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {Array.isArray(selectedApp.parsed_skills)
                  ? selectedApp.parsed_skills.join(", ")
                  : selectedApp.parsed_skills || "N/A"}
              </p>
              <p>
                <strong>Cover Letter:</strong>{" "}
                {selectedApp.cover_letter || "N/A"}
              </p>
              {selectedApp.resume && (
                <p>
                  <strong>Resume:</strong>{" "}
                  <a
                    href={`http://127.0.0.1:8000${selectedApp.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    type="application/pdf"
                  >
                    📄 View Resume
                  </a>
                </p>
              )}
            </div>

            <div className="modal-section">
              <label htmlFor="status">Update Status:</label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accept</option>
                <option value="rejected">Reject</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button onClick={updateStatus}>Update Status</button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRApplications;
