import React, { useEffect, useState } from "react";
import axios from "axios";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import SchoolIcon from "@mui/icons-material/School";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useLocation } from "react-router-dom";
import CandidatesNavbar from "../../components/Navbar/CandidatesNavbar";
import "./CandidateJobs.css";
import API_BASE_URL from "../../config";

const CandidateJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMyApplicationsModal, setShowMyApplicationsModal] = useState(false); // New state for applications modal
  const [consentGiven, setConsentGiven] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Filter out jobs that the candidate has already applied to
  const appliedJobIds = applications.map((app) => app.job); // assuming app.job is the job ID
  const availableJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery) || job.company.toLowerCase().includes(searchQuery) || job.description.toLowerCase().includes(searchQuery);
    return job.is_active && matchesSearch;
  });

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
        const res = await axios.get(`${API_BASE_URL}/api/jobs/`, {
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
          `${API_BASE_URL}/api/applications/my-applications/`,
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

  const submitApplication = async () => {
    if (!resumeFile) {
      setMessage("Please provide your resume.");
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append("job", selectedJob.id);
    form.append("resume", resumeFile);

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`${API_BASE_URL}/api/applications/apply/`, form, {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="candidate_jobs_container">
      <CandidatesNavbar />
      <main className="candidate-jobs-main">
        {/* Page Header */}
        <div className="jobs-page-header">
          <div className="jobs-header-back">
            <button onClick={() => navigate(-1)} className="back-btn-modern">
              <ArrowBackIcon fontSize="small" /> Back
            </button>
          </div>

          <h1 className="jobs-page-title">
            Job Listings
          </h1>

          <div className="jobs-header-actions">
            <button
              onClick={toggleMyApplicationsModal}
              className="my-apps-btn-modern"
            >
              <AssignmentIndIcon fontSize="small" />
              <span className="hidden-sm">My Applications</span>
            </button>
          </div>
        </div>

        {/* My Applications Modal */}
        {showMyApplicationsModal && (
          <div className="modal-overlay-premium active">
            <div className="modal-premium" style={{ maxWidth: '600px' }}>
              <div className="modal-header-premium">
                <div className="modal-title-group">
                  <div className="modal-icon-container">
                    <AssignmentIndIcon />
                  </div>
                  <div className="modal-title-text">
                    <h2>My Applications</h2>
                    <p>Track the status of your submitted applications.</p>
                  </div>
                </div>
                <button
                  onClick={toggleMyApplicationsModal}
                  className="btn-close-modal"
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="modal-form-content">
                {applications.length > 0 ? (
                  <div className="app-history-list">
                    {applications.map((app) => {
                      const statusClass = `status-${(app.status || 'applied').toLowerCase()}`;
                      return (
                        <div key={app.id} className="app-history-card">
                          <div className="app-history-info">
                            <h4>{app.job_title || app.job?.title || "N/A"}</h4>
                            <p>Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className={`app-history-status ${statusClass}`}>
                            {app.status || 'Applied'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-apps-message-premium">
                    <div className="empty-icon"><WorkOutlineIcon /></div>
                    <p>You haven't applied to any jobs yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className="job-list-wrapper">
          {availableJobs.length === 0 ? (
            <p className="no-jobs">
              No jobs available or you've applied to all.
            </p>
          ) : (
            availableJobs.map((job) => (
              <article key={job.id} className="job-card-modern">
                <div className="job-card-header-modern">
                  <WorkOutlineIcon className="job-icon-modern" />
                  <h2>{job.title}</h2>
                </div>
                <p className="job-desc-modern">
                  {job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
                </p>
                <div className="job-card-footer-modern">
                  {appliedJobIds.includes(job.id) ? (
                    <button className="apply-btn-modern disabled" disabled>
                      Already Applied
                    </button>
                  ) : (
                    <button
                      className="apply-btn-modern"
                      onClick={() => openApplyModal(job)}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {/* Apply for Job Modal */}
        {selectedJob && (
          <div className="modal-overlay-premium active">
            <div className="modal-premium">
              <div className="modal-header-premium">
                <div className="modal-title-group">
                  <div className="modal-icon-container">
                    <WorkIcon />
                  </div>
                  <div className="modal-title-text">
                    <h2>Job Details: {selectedJob.title}</h2>
                    <p>Review the details of this job posting below.</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="btn-close-modal"
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="modal-form-content">
                {message && (
                  <div
                    className={`msg ${
                      message.type === "success" ? "msg-success" : "msg-error"
                    }`}
                    style={{ marginBottom: "1rem" }}
                  >
                    {message.text}
                  </div>
                )}
                
                <div className="form-group-premium">
                  <label>Company Name</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><BusinessIcon /></div>
                    <input type="text" value={selectedJob.company} disabled />
                  </div>
                </div>

                <div className="form-group-premium">
                  <label>Location</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><LocationOnIcon /></div>
                    <input type="text" value={selectedJob.location} disabled />
                  </div>
                </div>

                <div className="form-group-premium">
                  <label>Job Description</label>
                  <div className="input-wrapper textarea-wrapper">
                    <div className="input-icon"><DescriptionIcon /></div>
                    <textarea value={selectedJob.description} disabled rows={4} />
                  </div>
                </div>

                <div className="form-group-premium">
                  <label>Preferred Education</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><SchoolIcon /></div>
                    <input type="text" value={selectedJob.preferred_education} disabled />
                  </div>
                </div>

                <div className="form-group-premium">
                  <label>Required Skills</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><AssignmentIndIcon /></div>
                    <input type="text" value={selectedJob.required_skills?.join(", ")} disabled />
                  </div>
                </div>

                <div className="form-group-premium">
                  <label>Preferred Titles</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><WorkOutlineIcon /></div>
                    <input type="text" value={selectedJob.preferred_titles?.join(", ")} disabled />
                  </div>
                </div>

                <hr style={{ margin: "2rem 0", borderTop: "1px dashed #cbd5e1" }} />

                <div className="apply-form-premium">
                  <h3 className="form-title" style={{ marginTop: 0 }}>Your Application</h3>
                  
                  <div className="premium-file-upload">
                    <input
                      type="file"
                      onChange={handleResumeChange}
                      className="hidden-file-input"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="resume-upload" className="file-upload-label">
                      <div className="upload-icon-circle">
                        {resumeFile ? <CheckCircleIcon className="success-icon" /> : <UploadFileIcon className="upload-icon" />}
                      </div>
                      <span className="upload-main-text">
                        {resumeFile ? resumeFile.name : "Click to upload your resume"}
                      </span>
                      <span className="upload-sub-text">
                        {resumeFile ? "File selected successfully" : "PDF, DOCX up to 5MB"}
                      </span>
                    </label>
                  </div>

                  <div className="premium-consent">
                    <label className="custom-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                      />
                      <span className="custom-checkmark"></span>
                      <span className="consent-text">
                        I agree to the processing of my personal data according to the Privacy Policy.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-actions-premium">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-modal-primary"
                  onClick={submitApplication}
                  disabled={!consentGiven || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "+ Submit Application"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CandidateJobs;
