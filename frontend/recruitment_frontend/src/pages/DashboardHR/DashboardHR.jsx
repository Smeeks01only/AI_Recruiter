import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, NavLink } from "react-router-dom"; // useLocation for active nav link
import axios from "axios";
import HRLayout from "../../components/Layout/HRLayout";
import "./DashboardHR.css";

// Import Material UI Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkIcon from "@mui/icons-material/Work";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import BusinessIcon from "@mui/icons-material/Business"; // For Company
import LocationOnIcon from "@mui/icons-material/LocationOn"; // For Location
import CloseIcon from "@mui/icons-material/Close"; // For modal close
import API_BASE_URL from "../../config";

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
    required_skills: "",
    preferred_education: "",
    preferred_titles: "",
    is_active: true,
  });

  const [message, setMessage] = useState({ text: "", type: "" }); // type can be 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation(); // For active navigation link
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const API_URL = `${API_BASE_URL}/api`;
  const token = localStorage.getItem("accessToken");

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery) || 
    job.company.toLowerCase().includes(searchQuery) ||
    job.location.toLowerCase().includes(searchQuery)
  );

  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      company: "",
      required_skills: "",
      preferred_education: "",
      preferred_titles: "",
      is_active: true,
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
      const res = await axios.get(`${API_URL}/jobs/`, {
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
    const { name, value, type } = e.target;
    // Handle select element boolean values properly
    if (name === "is_active") {
      setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // We no longer aggressively parse the array on every keystroke
  // to avoid stripping trailing spaces and commas.

  const handleCreateJob = async () => {
    setIsLoading(true);
    
    // Parse strings to arrays before sending to API
    const payload = {
      ...formData,
      required_skills: typeof formData.required_skills === 'string' 
        ? formData.required_skills.split(",").map(s => s.trim()).filter(s => s)
        : formData.required_skills,
      preferred_titles: typeof formData.preferred_titles === 'string'
        ? formData.preferred_titles.split(",").map(s => s.trim()).filter(s => s)
        : formData.preferred_titles,
    };

    try {
      await axios.post(`${API_URL}/jobs/create/`, payload, {
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
      required_skills: Array.isArray(job.required_skills) ? job.required_skills.join(", ") : (job.required_skills || ""),
      preferred_education: job.preferred_education || "",
      preferred_titles: Array.isArray(job.preferred_titles) ? job.preferred_titles.join(", ") : (job.preferred_titles || ""),
    });
    setShowEditModal(true);
  };

  const handleEditJob = async () => {
    if (!currentJob) return;
    setIsLoading(true);

    const payload = {
      ...formData,
      required_skills: typeof formData.required_skills === 'string' 
        ? formData.required_skills.split(",").map(s => s.trim()).filter(s => s)
        : formData.required_skills,
      preferred_titles: typeof formData.preferred_titles === 'string'
        ? formData.preferred_titles.split(",").map(s => s.trim()).filter(s => s)
        : formData.preferred_titles,
    };

    try {
      await axios.put(`${API_URL}/jobs/${currentJob.id}/`, payload, {
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
      await axios.delete(`${API_URL}/jobs/${id}/`, {
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
      required_skills: Array.isArray(job.required_skills) ? job.required_skills.join(", ") : (job.required_skills || ""),
      preferred_education: job.preferred_education || "",
      preferred_titles: Array.isArray(job.preferred_titles) ? job.preferred_titles.join(", ") : (job.preferred_titles || ""),
      is_active: job.is_active,
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

  // Removed custom NavLink component
  // Form fields configuration for modals
  const formFields = [
    {
      name: "title",
      placeholder: "e.g. AI Engineer Intern",
      label: "Job Title",
      required: true,
      icon: <PersonOutlineIcon />,
    },
    {
      name: "company",
      placeholder: "e.g. GeekInnov",
      label: "Company Name",
      required: true,
      icon: <BusinessIcon />,
    },
    {
      name: "location",
      placeholder: "e.g. On site",
      label: "Location",
      required: true,
      icon: <LocationOnIcon />,
    },
    {
      name: "description",
      placeholder: "e.g. Work on NLP, ML pipelines and resume rankings",
      label: "Job Description",
      type: "textarea",
      required: true,
      icon: <DescriptionOutlinedIcon />,
    },
    {
      name: "preferred_education",
      placeholder: "e.g. Bachelor's in CS",
      label: "Preferred Education",
      icon: <SchoolOutlinedIcon />,
    },
    {
      name: "required_skills",
      placeholder: "e.g. Python, Machine Learning, SQL",
      label: "Required Skills",
      type: "array",
      icon: <StarBorderIcon />,
    },
    {
      name: "preferred_titles",
      placeholder: "e.g. Software Developer, ML Engineer",
      label: "Preferred Previous Titles",
      type: "array",
      icon: <PersonOutlineIcon />,
    },
    {
      name: "is_active",
      label: "Job Status",
      type: "select",
      options: [
        { label: "Open (Accepting Applications)", value: true },
        { label: "Closed (No longer accepting)", value: false },
      ],
      icon: <SettingsIcon />,
    },
  ];

  const renderModalForm = (isEditMode) => (
    <>
      <div className="modal-form-content">
        {formFields.map((field) => (
          <div className="form-group-premium" key={field.name}>
            <label htmlFor={field.name}>
              {field.label} {field.required && <span className="required-star">*</span>}
            </label>
            <div className={`input-wrapper ${field.type === "textarea" ? "textarea-wrapper" : ""}`}>
              <div className="input-icon">{field.icon}</div>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="modal-select-input"
                >
                  {field.options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              )}
            </div>
            {field.type === "array" && (
              <small className="helper-text">Enter values separated by commas.</small>
            )}
          </div>
        ))}
      </div>
      <div className="modal-actions-premium">
        <button
          type="button"
          className="btn-modal-cancel"
          onClick={closeModal}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-modal-primary"
          onClick={isEditMode ? handleEditJob : handleCreateJob}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : isEditMode ? "+ Update Job" : "+ Create Job"}
        </button>
      </div>
    </>
  );

  return (
    <HRLayout>
      <div className="hr-banner">
            <div className="hr-banner-text">
              <span className="hr-banner-pill">HR Management</span>
              <h2>Jobs Management</h2>
              <p>Create, manage and track all your job postings in one place.</p>
            </div>
            <div className="hr-banner-action">
              <button
                onClick={() => {
                  resetFormData();
                  setShowCreateModal(true);
                }}
                className="btn-create-job"
              >
                <AddCircleOutlineIcon /> Create New Job
              </button>
            </div>
          </div>

        {message.text && (
          <div className={`message-toast ${message.type}`}>{message.text}</div>
        )}

        {
          isLoading && filteredJobs.length === 0 && (
            <p>Loading jobs...</p>
          ) /* Initial loading state */
        }
        {!isLoading && filteredJobs.length === 0 && (
          <div className="no-jobs-message">
            <p>No jobs found. Try a different search or click "Create New Job" to get started!</p>
          </div>
        )}

        <div className="job-grid">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="job-card-premium clickable-card"
              onClick={() => openDetailsModal(job)}
            >
              <div className="job-card-header">
                <div className="job-card-title-container">
                  <div className="job-icon-container">
                    <WorkIcon />
                  </div>
                  <h3>{job.title}</h3>
                </div>
                <span className={`job-status ${job.is_active ? 'open' : 'closed'}`}>
                  <span className={`status-dot ${job.is_active ? 'green' : 'grey'}`}></span> 
                  {job.is_active ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="job-card-details">
                <p className="job-card-company">
                  <BusinessIcon /> {job.company}
                </p>
                <p className="job-card-location">
                  <LocationOnIcon /> {job.location}
                </p>
              </div>

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
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(job);
                    }}
                    className="btn-icon edit"
                    title="Edit Job"
                    disabled={isLoading}
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job.id);
                    }}
                    className="btn-icon delete"
                    title="Delete Job"
                    disabled={isLoading}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetailsModal(job);
                    }}
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

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="modal-overlay-premium">
          <div className="modal-premium">
            <div className="modal-header-premium">
              <div className="modal-title-group">
                <div className="modal-icon-container">
                  <WorkIcon />
                </div>
                <div className="modal-title-text">
                  <h2>Create New Job</h2>
                  <p>Provide the key details about the job posting. This will help us match the right candidates and improve results.</p>
                </div>
              </div>
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
        <div className="modal-overlay-premium">
          <div className="modal-premium">
            <div className="modal-header-premium">
              <div className="modal-title-group">
                <div className="modal-icon-container">
                  <WorkIcon />
                </div>
                <div className="modal-title-text">
                  <h2>Edit Job: {currentJob.title}</h2>
                  <p>Update the key details about the job posting to ensure accurate matches.</p>
                </div>
              </div>
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
        <div className="modal-overlay-premium">
          <div className="modal-premium">
            <div className="modal-header-premium">
              <div className="modal-title-group">
                <div className="modal-icon-container">
                  <WorkIcon />
                </div>
                <div className="modal-title-text">
                  <h2>Job Details: {currentJob.title}</h2>
                  <p>Review the details of this job posting below.</p>
                </div>
              </div>
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
    </HRLayout>
  );
};

export default DashboardHR;
