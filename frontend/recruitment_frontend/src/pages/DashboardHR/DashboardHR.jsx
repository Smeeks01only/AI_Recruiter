import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation for active nav link
import axios from "axios";
import HRNavbar from "../../components/Navbar/HRNavbar";
import "./DashboardHR.css";

// Import Material UI Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import BusinessIcon from "@mui/icons-material/Business"; // For Company
import LocationOnIcon from "@mui/icons-material/LocationOn"; // For Location
import CloseIcon from "@mui/icons-material/Close"; // For modal close

const DashboardHR = () => {
  const [jobs, setJobs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    company: "",
    required_skills: [],
    preferred_education: "",
    preferred_titles: [],
  });

  const [message, setMessage] = useState({ text: "", type: "" }); // type can be 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation(); // For active navigation link

  const API_BASE_URL = "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("accessToken");

  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      company: "",
      required_skills: [],
      preferred_education: "",
      preferred_titles: [],
    });
  };

  const displayMessage = (text, type, duration = 3000) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, duration);
  };

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/jobs/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      displayMessage("Failed to fetch jobs.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill), // Trim and filter empty
    }));
  };

  const handleCreateJob = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/jobs/create/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      displayMessage("Job created successfully.", "success");
      setShowCreateModal(false);
      resetFormData();
      fetchJobs();
    } catch (err) {
      console.error("Create job error:", err.response?.data || err.message);
      displayMessage(
        err.response?.data?.detail ||
          "Failed to create job. Check console for details.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (job) => {
    setCurrentJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      company: job.company,
      required_skills: job.required_skills || [],
      preferred_education: job.preferred_education || "",
      preferred_titles: job.preferred_titles || [],
    });
    setShowEditModal(true);
  };

  const handleEditJob = async () => {
    if (!currentJob) return;
    setIsLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/jobs/${currentJob.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      displayMessage("Job updated successfully.", "success");
      setShowEditModal(false);
      resetFormData();
      setCurrentJob(null);
      fetchJobs();
    } catch (err) {
      console.error("Update job error:", err.response?.data || err.message);
      displayMessage(
        err.response?.data?.detail ||
          "Failed to update job. Check console for details.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    )
      return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/jobs/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      displayMessage("Job deleted successfully.", "success");
      fetchJobs(); // Re-fetch jobs to update the list
    } catch (err) {
      console.error("Delete job error:", err);
      displayMessage("Failed to delete job.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const openDetailsModal = (job) => {
    setCurrentJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      company: job.company,
      required_skills: job.required_skills || [],
      preferred_education: job.preferred_education || "",
      preferred_titles: job.preferred_titles || [],
    });
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    resetFormData();
    setCurrentJob(null);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    resetFormData();
    setCurrentJob(null);
  };

  const NavLink = ({ to, icon, children }) => (
    <li>
      <Link to={to} className={location.pathname === to ? "active" : ""}>
        {icon}
        {children}
      </Link>
    </li>
  );

  // Form fields configuration for modals
  const formFields = [
    {
      name: "title",
      placeholder: "E.g. Senior Software Engineer",
      label: "Job Title",
      required: true,
    },
    {
      name: "company",
      placeholder: "E.g. Tech Solutions Inc.",
      label: "Company Name",
      required: true,
    },
    {
      name: "location",
      placeholder: "E.g. San Francisco, CA or Remote",
      label: "Location",
      required: true,
    },
    {
      name: "description",
      placeholder: "Describe the job responsibilities, requirements, etc.",
      label: "Job Description",
      type: "textarea",
      required: true,
    },
    {
      name: "preferred_education",
      placeholder: "E.g. Bachelor's in CS",
      label: "Preferred Education",
    },
    {
      name: "required_skills",
      placeholder: "E.g. React,Node.js,Python",
      label: "Required Skills",
      type: "array",
    },
    {
      name: "preferred_titles",
      placeholder: "E.g. Full Stack Developer,Backend Engineer",
      label: "Preferred Previous Titles",
      type: "array",
    },
  ];

  const renderModalForm = (isEditMode) => (
    <>
      {formFields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>
            {field.label}
            {field.required && "*"}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleInputChange}
              disabled={isLoading}
              rows={5}
            />
          ) : field.type === "array" ? (
            <input
              type="text"
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={
                Array.isArray(formData[field.name])
                  ? formData[field.name].join(",")
                  : ""
              }
              onChange={(e) => handleArrayInputChange(e, field.name)}
              disabled={isLoading}
            />
          ) : (
            <input
              type="text"
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          )}
          {field.type === "array" && (
            <small>Enter values separated by commas.</small>
          )}
        </div>
      ))}
      <div className="modal-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={closeModal}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={isEditMode ? handleEditJob : handleCreateJob}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : isEditMode ? "Update Job" : "Create Job"}
        </button>
      </div>
    </>
  );

  return (
    <div className="hr-dashboard-container">
      <main className="main-content">
        <HRNavbar />
        <div className="dashboard-header">
          <h1>Jobs Management</h1>
          <button
            onClick={() => {
              resetFormData();
              setShowCreateModal(true);
            }}
            className="btn btn-primary"
          >
            <AddCircleOutlineIcon /> Create New Job
          </button>
        </div>

        {message.text && (
          <div className={`message-toast ${message.type}`}>{message.text}</div>
        )}

        {
          isLoading && jobs.length === 0 && (
            <p>Loading jobs...</p>
          ) /* Initial loading state */
        }
        {!isLoading && jobs.length === 0 && (
          <div className="no-jobs-message">
            <p>No jobs posted yet. Click "Create New Job" to get started!</p>
          </div>
        )}

        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job_card">
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className=/*{`job-status ${job.status}`}*/ "job-status open">
                  {/*job.status*/}Open
                </span>
              </div>
              <p className="job-card-company">
                <BusinessIcon /> {job.company}
              </p>
              <p className="job-card-location">
                <LocationOnIcon /> {job.location}
              </p>

              <div className="job-card-creator">
                <div className="job-card-creator-profile">
                  <img
                    src={
                      job.created_by_id?.profile_image ||
                      "https://api.dicebear.com/7.x/pixel-art/svg/seed123"
                    }
                    alt="Profile"
                    className="creator-avatar"
                  />

                  <div className="job-card-creator-info">
                    <p>
                      {job.created_by_id?.first_name || "N/A"}{" "}
                      {job.created_by_id?.last_name || ""}
                    </p>
                    <span>person@email.com</span>
                  </div>
                </div>

                <div className="job-card-actions">
                  <button
                    onClick={() => openEditModal(job)}
                    className="btn-icon edit"
                    title="Edit Job"
                    disabled={isLoading}
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="btn-icon delete"
                    title="Delete Job"
                    disabled={isLoading}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    onClick={() => openDetailsModal(job)}
                    className="btn-icon details"
                    title="View Details"
                    disabled={isLoading}
                  >
                    <InfoOutlinedIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Job</h2>
              <button
                onClick={closeModal}
                className="btn-close-modal"
                aria-label="Close modal"
                disabled={isLoading}
              >
                <CloseIcon />
              </button>
            </div>
            {renderModalForm(false)}
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && currentJob && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Job: {currentJob.title}</h2>
              <button
                onClick={closeModal}
                className="btn-close-modal"
                aria-label="Close modal"
                disabled={isLoading}
              >
                <CloseIcon />
              </button>
            </div>
            {renderModalForm(true)}
          </div>
        </div>
      )}
      {/* Job Details Modal */}
      {showDetailsModal && currentJob && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Job Details: {currentJob.title}</h2>
              <button
                onClick={closeDetailsModal}
                className="btn-close-modal"
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>
            {renderModalForm(false)} {/* false makes it read-only */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHR;
