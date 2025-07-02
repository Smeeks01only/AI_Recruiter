import React, { useEffect, useState } from "react";
import axios from "axios";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CandidatesNavbar from "../../components/Navbar/CandidatesNavbar";
import "./CandidateJobs.css";

const CandidateJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState("");
  const [message, setMessage] = useState("");
  const [showMyApplicationsModal, setShowMyApplicationsModal] = useState(false); // New state for applications modal
  const [consentGiven, setConsentGiven] = useState(false);
  // Filter out jobs that the candidate has already applied to
  const appliedJobIds = applications.map((app) => app.job); // assuming app.job is the job ID
  const availableJobs = jobs.filter((job) => !appliedJobIds.includes(job.id));

  useEffect(() => {
    if (showMyApplicationsModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showMyApplicationsModal]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://127.0.0.1:8000/api/jobs/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    const fetchApplications = async () => {
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
        console.error("Error fetching applications:", err);
      }
    };

    fetchJobs();
    fetchApplications();
  }, []);

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setResumeFile(null);
    setCoverLetterFile(null);
    setMessage("");
  };

  const closeModal = () => {
    setSelectedJob(null);
    setMessage("");
  };

  // Toggle function for "My Applications" modal
  const toggleMyApplicationsModal = () => {
    setShowMyApplicationsModal(!showMyApplicationsModal);
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleCoverLetterChange = (e) => {
    setCoverLetterFile(e.target.files[0]);
  };

  const submitApplication = async () => {
    if (!resumeFile || !coverLetterFile.trim()) {
      setMessage("Please provide both resume and cover letter.");
      return;
    }

    const form = new FormData();
    form.append("job", selectedJob.id);
    form.append("resume", resumeFile);
    form.append("cover_letter", coverLetterFile); // now it's just plain text

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post("http://127.0.0.1:8000/api/applications/apply/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage({
        type: "success",
        text: "🎉 Application submitted successfully!",
      });
      // Optionally, refetch applications after submitting a new one
      // fetchApplications();
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Apply error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "❌ Failed to submit application.",
      });
    }
  };

  return (
    <div className="candidate_jobs_container">
      <CandidatesNavbar />
      <div className="candidate-jobs">
        <div className="header-actions">
          <h1 className="page-title">Job Listings</h1>
          <button
            onClick={toggleMyApplicationsModal}
            className="my-applications-btn"
          >
            <AssignmentIndIcon className="btn-icon" />
            <span>My Applications</span>
          </button>
        </div>

        {/* My Applications Modal */}
        {showMyApplicationsModal && (
          <div className="modal-overlay active">
            <div className="modal">
              <h2 className="modal-title">My Applications</h2>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="application-card-modal">
                    <p>
                      <strong>Job Title:</strong>{" "}
                      {app.job_title || app.job?.title || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong> {app.status}
                    </p>
                    <p>
                      <strong>Applied On:</strong>{" "}
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-apps-text">
                  You haven't applied to any jobs yet.
                </p>
              )}
              <button className="close-btn" onClick={toggleMyApplicationsModal}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Job Listings */}
        {/* Job Listings */}
        <div className="job-listings-container">
          {availableJobs.length === 0 ? (
            <p className="no-jobs">
              No jobs available or you've applied to all.
            </p>
          ) : (
            availableJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job_card_header">
                  <WorkOutlineIcon className="job-icon" />
                  <h2>{job.title}</h2>
                </div>
                <p className="job-desc">
                  {job.description.substring(0, 150)}...
                </p>
                <div className="job-card-footer">
                  <button
                    className="apply-btn"
                    onClick={() => openApplyModal(job)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Apply for Job Modal */}
        {selectedJob && (
          <div className="modal-overlay active">
            <div className="modal">
              {message && (
                <div
                  className={`msg ${
                    message.type === "success" ? "msg-success" : "msg-error"
                  }`}
                >
                  {message.text}
                </div>
              )}
              <h2 className="modal-title">{selectedJob.title}</h2>
              <div className="job-details">
                <p>
                  <strong>Company:</strong> {selectedJob.company}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob.location}
                </p>
                <p>
                  <strong>Description:</strong> {selectedJob.description}
                </p>
                <p>
                  <strong>Required Skills:</strong>{" "}
                  {selectedJob.required_skills?.join(", ")}
                </p>
                <p>
                  <strong>Preferred Education:</strong>{" "}
                  {selectedJob.preferred_education}
                </p>
                <p>
                  <strong>Preferred Titles:</strong>{" "}
                  {selectedJob.preferred_titles?.join(", ")}
                </p>
              </div>

              <div className="apply-form">
                <label className="input-label">Upload Resume</label>
                <input
                  type="file"
                  onChange={handleResumeChange}
                  className="file-input"
                />

                <label className="input-label">Cover Letter</label>
                <textarea
                  rows="6"
                  placeholder="Write your cover letter here..."
                  value={coverLetterFile}
                  onChange={(e) => setCoverLetterFile(e.target.value)}
                  className="textarea-input"
                ></textarea>
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  required
                />
                <label>
                  I consent to my data being processed in accordance with
                  GDPR/CCPA and the Privacy Policy.
                </label>

                <div className="form-buttons">
                  <button
                    onClick={submitApplication}
                    className="submit-btn"
                    disabled={!consentGiven}
                  >
                    Submit Application
                  </button>
                  <button onClick={closeModal} className="close-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateJobs;
