import React, { useEffect, useState } from "react";
import axios from "axios";
import HRLayout from "../../components/Layout/HRLayout";
import "./HRApplications.css";

// Material UI Icons
import WorkIcon from "@mui/icons-material/Work";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CancelIcon from "@mui/icons-material/Cancel";
import CodeIcon from "@mui/icons-material/Code";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import NotesIcon from "@mui/icons-material/Notes";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import DownloadIcon from "@mui/icons-material/Download";
import API_BASE_URL from "../../config";

const HRApplications = () => {
  const [groupedApplications, setGroupedApplications] = useState({});
  const [searchQueries, setSearchQueries] = useState({});
  const [sortOrders, setSortOrders] = useState({});
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [stats, setStats] = useState({ total: 0, shortlisted: 0, pending: 0, rejected: 0 });
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [selectedJobFilter, setSelectedJobFilter] = useState("All Jobs");
  const [isJobFilterOpen, setIsJobFilterOpen] = useState(false);
  const [selectedApps, setSelectedApps] = useState(new Set());

  function capitalizeFirstLetter(name) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  const getInitials = (first, last) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  const getSkillsList = (skillsData) => {
    if (!skillsData) return [];
    if (Array.isArray(skillsData)) return skillsData;
    if (typeof skillsData === "string") return skillsData.split(",").map((s) => s.trim());
    return [];
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/applications/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const grouped = {};
      let s = { total: res.data.length, shortlisted: 0, pending: 0, rejected: 0 };

      res.data.forEach((app) => {
        if (!grouped[app.job_title]) {
          grouped[app.job_title] = [];
        }
        grouped[app.job_title].push(app);

        const status = (app.status || "").toLowerCase();
        if (status === "accepted" || status === "shortlisted") s.shortlisted++;
        else if (status === "rejected") s.rejected++;
        else s.pending++;
      });

      for (let title in grouped) {
        grouped[title].sort(
          (a, b) => (b.ai_score || 0) - (a.ai_score || 0)
        );
      }

      setStats(s);
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
        `${API_BASE_URL}/api/applications/${selectedApp.id}/update_status/`,
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

  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/applications/${id}/delete/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      fetchApplications();
    } catch (err) {
      console.error("Failed to delete application", err);
      alert("Failed to delete application.");
    }
  };

  const toggleSelection = (appId) => {
    const newSelection = new Set(selectedApps);
    if (newSelection.has(appId)) {
      newSelection.delete(appId);
    } else {
      newSelection.add(appId);
    }
    setSelectedApps(newSelection);
  };

  const toggleSelectAll = (jobApps) => {
    const allIds = jobApps.map(a => a.id);
    const areAllSelected = allIds.every(id => selectedApps.has(id));
    
    const newSelection = new Set(selectedApps);
    if (areAllSelected) {
      allIds.forEach(id => newSelection.delete(id));
    } else {
      allIds.forEach(id => newSelection.add(id));
    }
    setSelectedApps(newSelection);
  };

  const handleDownloadSelected = async () => {
    if (selectedApps.size === 0) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/applications/download-marked/`, 
        { application_ids: Array.from(selectedApps) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          responseType: 'blob' 
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ai_marked_resumes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSelectedApps(new Set()); // Clear selection after download
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download marked resumes. Check console.");
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
    <HRLayout>
      <div className="hr-applications">
      <div className="hr-applications-header">
        <div className="apps-title-section">
          <div className="apps-icon">
            <WorkIcon />
          </div>
          <div className="apps-title-text">
            <h2>Job Applications</h2>
            <p>Manage and track all candidate applications across your job postings.</p>
          </div>
        </div>

        <div className="apps-stats-section">
          <div className="stat-card">
            <div className="stat-icon total"><PeopleAltIcon /></div>
            <div className="stat-info">
              <span className="stat-label">Total Applications</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon shortlisted"><CheckCircleIcon /></div>
            <div className="stat-info">
              <span className="stat-label">Shortlisted</span>
              <span className="stat-value">{stats.shortlisted}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending"><AccessTimeFilledIcon /></div>
            <div className="stat-info">
              <span className="stat-label">In Review</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rejected"><CancelIcon /></div>
            <div className="stat-info">
              <span className="stat-label">Rejected</span>
              <span className="stat-value">{stats.rejected}</span>
            </div>
          </div>
          
          <div className="stat-card filter-card custom-dropdown-container">
            <div 
              className="custom-dropdown-trigger"
              onClick={() => setIsJobFilterOpen(!isJobFilterOpen)}
            >
              <span className="dropdown-label">
                {selectedJobFilter === "All Jobs" ? `All Jobs (${stats.total})` : selectedJobFilter}
              </span>
              <svg className={`dropdown-arrow ${isJobFilterOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            
            {isJobFilterOpen && (
              <div className="custom-dropdown-menu">
                <div 
                  className={`custom-dropdown-item ${selectedJobFilter === "All Jobs" ? 'active' : ''}`}
                  onClick={() => { setSelectedJobFilter("All Jobs"); setIsJobFilterOpen(false); }}
                >
                  All Jobs ({stats.total})
                </div>
                {Object.keys(groupedApplications).map((jobTitle) => (
                  <div 
                    key={jobTitle} 
                    className={`custom-dropdown-item ${selectedJobFilter === jobTitle ? 'active' : ''}`}
                    onClick={() => { setSelectedJobFilter(jobTitle); setIsJobFilterOpen(false); }}
                  >
                    {jobTitle} ({groupedApplications[jobTitle].length})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {Object.keys(groupedApplications).length === 0 ? (
        <div className="no-apps-message">No applications found.</div>
      ) : (
        Object.entries(groupedApplications)
          .filter(([jobTitle]) => selectedJobFilter === "All Jobs" || jobTitle === selectedJobFilter)
          .map(([jobTitle, apps]) => (
            <div key={jobTitle} className="job-group-premium">
            <div className="job-group-header">
              <div className="job-group-info">
                <div className="job-group-icon"><CodeIcon /></div>
                <div className="job-group-title-col">
                  <div className="job-title-row">
                    <h3>{jobTitle}</h3>
                    <span className="app-count-pill">{apps.length} applications</span>
                  </div>
                  <p className="job-meta">Posted recently • Remote</p>
                </div>
              </div>
              <div className="job-group-actions">
                <label className="select-all-label">
                  <input 
                    type="checkbox" 
                    checked={apps.length > 0 && apps.every(app => selectedApps.has(app.id))}
                    onChange={() => toggleSelectAll(apps)}
                  /> Select All
                </label>
                <div className="search-bar">
                  <SearchIcon />
                  <input 
                    type="text" 
                    placeholder="Search candidates for this job..." 
                    value={searchQueries[jobTitle] || ""}
                    onChange={(e) => setSearchQueries(prev => ({...prev, [jobTitle]: e.target.value}))}
                  />
                </div>
                <select 
                  className="filter-dropdown sort-select"
                  value={sortOrders[jobTitle] || "desc"}
                  onChange={(e) => setSortOrders(prev => ({...prev, [jobTitle]: e.target.value}))}
                >
                  <option value="desc">Score: Highest</option>
                  <option value="asc">Score: Lowest</option>
                </select>
                <div className="filter-dropdown">
                  <FilterListIcon /> All Statuses
                </div>
                <button className="view-toggle">
                  <ViewListIcon />
                </button>
              </div>
            </div>

            <div className="candidate-grid">
              {apps.filter(app => {
                const q = (searchQueries[jobTitle] || "").toLowerCase();
                if (!q) return true;
                const name = `${app.applicant_first_name} ${app.applicant_last_name}`.toLowerCase();
                const email = (app.applicant_email || "").toLowerCase();
                return name.includes(q) || email.includes(q);
              }).sort((a, b) => {
                const order = sortOrders[jobTitle] || "desc";
                if (order === "desc") {
                  return (b.ai_score || 0) - (a.ai_score || 0);
                } else {
                  return (a.ai_score || 0) - (b.ai_score || 0);
                }
              }).map((app) => (
                <div className={`candidate-card-premium ${selectedApps.has(app.id) ? 'selected' : ''}`} key={app.id}>
                  <div className="cand-header">
                    <div className="cand-profile">
                      <input 
                        type="checkbox" 
                        className="cand-select-checkbox"
                        checked={selectedApps.has(app.id)}
                        onChange={() => toggleSelection(app.id)}
                      />
                      <div className="cand-avatar">{getInitials(app.applicant_first_name, app.applicant_last_name)}</div>
                      <div className="cand-name-col">
                        <h4>{capitalizeFirstLetter(app.applicant_first_name)} {capitalizeFirstLetter(app.applicant_last_name)}</h4>
                      </div>
                    </div>
                    <div className="cand-status-row" style={{ position: 'relative' }}>
                      <span className={`status-pill ${app.status.toLowerCase()}`}>{app.status}</span>
                      <MoreVertIcon 
                        className="more-icon" 
                        onClick={() => setMenuOpenFor(menuOpenFor === app.id ? null : app.id)} 
                      />
                      {menuOpenFor === app.id && (
                        <div className="app-dropdown-menu">
                          <button className="app-dropdown-item delete" onClick={() => {
                            setMenuOpenFor(null);
                            deleteApplication(app.id);
                          }}>
                            Delete Application
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="cand-score-section">
                    <div className="score-text">AI Score: <strong>{app.ai_score ?? 0}%</strong></div>
                    <div className="score-bar-bg">
                      <div className="score-bar-fill" style={{ width: `${app.ai_score ?? 0}%` }}></div>
                    </div>
                  </div>

                  <div className="cand-meta">
                    <p><CalendarTodayIcon /> Applied {new Date(app.created_at || Date.now()).toLocaleDateString()}</p>
                    <p><LocationOnIcon /> {app.parsed_location || "Location not provided"}</p>
                  </div>

                  <div className="cand-experience">
                    <strong>Experience:</strong> {app.match_explanation || "No explanation provided."}
                  </div>

                  <div className="cand-skills">
                    {getSkillsList(app.parsed_skills).slice(0, 3).map((skill, i) => (
                      <span className="skill-tag" key={i}>{skill}</span>
                    ))}
                    {getSkillsList(app.parsed_skills).length > 3 && (
                      <span className="skill-tag extra">+{getSkillsList(app.parsed_skills).length - 3}</span>
                    )}
                  </div>

                  <div className="cand-footer">
                    {app.resume ? (
                      <a href={`${API_BASE_URL}${app.resume}`} target="_blank" rel="noopener noreferrer" className="view-resume-link">
                        <DescriptionOutlinedIcon /> View Resume
                      </a>
                    ) : (
                      <span className="no-resume-text">No Resume</span>
                    )}
                    <button className="view-details-btn" onClick={() => openModal(app)}>
                      View Details <ArrowForwardIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="modal-overlay-premium active">
          <div className="modal-premium" style={{ width: '800px', maxWidth: '95%' }}>
            <div className="modal-header-premium">
              <div className="modal-title-group">
                <div className="modal-icon-container">
                  <PersonIcon />
                </div>
                <div className="modal-title-text">
                  <h2>Applicant Details: {selectedApp.applicant_first_name} {selectedApp.applicant_last_name}</h2>
                  <p>Review the candidate's application and AI evaluation.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="btn-close-modal"
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="modal-form-content">
              {/* Personal Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group-premium">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><PersonIcon /></div>
                    <input type="text" value={`${selectedApp.applicant_first_name} ${selectedApp.applicant_last_name}`} disabled />
                  </div>
                </div>
                <div className="form-group-premium">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><EmailIcon /></div>
                    <input type="text" value={selectedApp.applicant_email} disabled />
                  </div>
                </div>
                <div className="form-group-premium">
                  <label>Phone Number</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><PhoneIcon /></div>
                    <input type="text" value={selectedApp.parsed_phone || "Not provided"} disabled />
                  </div>
                </div>
                <div className="form-group-premium">
                  <label>Applied Job</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><WorkOutlineIcon /></div>
                    <input type="text" value={selectedApp.job_title} disabled />
                  </div>
                </div>
              </div>

              {/* AI Evaluation */}
              <hr style={{ margin: "1.5rem 0", borderTop: "1px dashed #cbd5e1" }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b' }}>AI Evaluation & Fit</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group-premium">
                  <label>AI Match Score</label>
                  <div className="input-wrapper" style={{ borderColor: '#3b82f6' }}>
                    <div className="input-icon" style={{ color: '#3b82f6' }}><AssessmentIcon /></div>
                    <input type="text" value={selectedApp.ai_score ? `${selectedApp.ai_score}/100` : "Pending Evaluation"} style={{ color: '#3b82f6', fontWeight: 'bold' }} disabled />
                  </div>
                </div>
                
                <div className="form-group-premium">
                  <label>Match Explanation</label>
                  <div className="input-wrapper textarea-wrapper">
                    <div className="input-icon"><DescriptionOutlinedIcon /></div>
                    <div className="read-only-text-box">
                      {selectedApp.match_explanation || "No explanation provided."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parsed Resume Details */}
              <hr style={{ margin: "1.5rem 0", borderTop: "1px dashed #cbd5e1" }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b' }}>Parsed Resume Data</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group-premium">
                  <label>Experience</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><WorkIcon /></div>
                    <input type="text" value={`${selectedApp.parsed_experience ?? 0} Years`} disabled />
                  </div>
                </div>
                <div className="form-group-premium">
                  <label>Education</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><SchoolIcon /></div>
                    <input type="text" value={selectedApp.parsed_education || "N/A"} disabled title={selectedApp.parsed_education} />
                  </div>
                </div>
                <div className="form-group-premium" style={{ gridColumn: 'span 2' }}>
                  <label>Skills</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><CodeIcon /></div>
                    <input type="text" value={Array.isArray(selectedApp.parsed_skills) ? selectedApp.parsed_skills.join(", ") : selectedApp.parsed_skills || "N/A"} disabled />
                  </div>
                </div>
                <div className="form-group-premium">
                  <label>Certifications</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><NotesIcon /></div>
                    <input type="text" value={selectedApp.parsed_certifications || "None"} disabled />
                  </div>
                </div>
                <div className="form-group-premium">
                  <label>Projects</label>
                  <div className="input-wrapper">
                    <div className="input-icon"><NotesIcon /></div>
                    <input type="text" value={selectedApp.parsed_projects_count ?? 0} disabled />
                  </div>
                </div>
                {selectedApp.resume && (
                  <div className="form-group-premium" style={{ gridColumn: 'span 2' }}>
                    <label>Original Resume</label>
                    <a
                      href={`${API_BASE_URL}${selectedApp.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-resume-btn-premium"
                    >
                      <ContactPageIcon /> View PDF Resume
                    </a>
                  </div>
                )}
              </div>

            </div>

            <div className="modal-actions-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="status-update-wrapper">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginRight: '0.8rem' }}>Update Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="status-select-premium"
                >
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="button" className="btn-modal-primary" onClick={updateStatus}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Action Bar */}
      {selectedApps.size > 0 && (
        <div className="floating-action-bar">
          <div className="fab-info">
            <span className="fab-count">{selectedApps.size}</span>
            <span> candidates selected</span>
          </div>
          <button className="btn-fab-download" onClick={handleDownloadSelected}>
            <DownloadIcon /> Download AI-Marked Resumes
          </button>
        </div>
      )}
      </div>
    </HRLayout>
  );
};

export default HRApplications;
