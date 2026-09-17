import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HRLayout from "../../components/Layout/HRLayout";
import axios from "axios";
import "./DashboardHR.css";
import API_BASE_URL from "../../config";

// Icons
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CloseIcon from "@mui/icons-material/Close";
import PsychologyIcon from "@mui/icons-material/Psychology";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const HROverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
    shortlistedApplications: 0,
    recentJobs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Shortlisted Modal State
  const [showShortlistedModal, setShowShortlistedModal] = useState(false);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [expandedCandidateId, setExpandedCandidateId] = useState(null);
  const [deepScreenJob, setDeepScreenJob] = useState(null);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningReport, setScreeningReport] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch jobs and applications concurrently
        const [jobsRes, appsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/jobs/`, { headers }),
          axios.get(`${API_BASE_URL}/api/applications/`, { headers })
        ]);

        const jobs = jobsRes.data;
        const apps = appsRes.data;

        const openJobs = jobs.filter(job => job.is_active).length;
        const shortlistedList = apps.filter(app => {
          const status = (app.status || "").toLowerCase();
          return status === "shortlisted" || status === "accepted";
        });
        
        setShortlistedCandidates(shortlistedList);
        
        // Sort jobs by ID descending to get the newest
        const recentJobs = [...jobs].sort((a, b) => b.id - a.id).slice(0, 5);

        setStats({
          totalJobs: jobs.length,
          openJobs,
          totalApplications: apps.length,
          shortlistedApplications: shortlistedList.length,
          recentJobs
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleJobDeepScreen = (jobTitle, candidates) => {
    setDeepScreenJob({ title: jobTitle, count: candidates.length });
    setIsScreening(true);
    setScreeningReport(null);
    
    // Simulate deep AI screening delay for the cohort
    setTimeout(() => {
      setIsScreening(false);
      setScreeningReport({
        strengths: ["Strong overall technical alignment across candidates", "Multiple candidates possess the core required skills"],
        weaknesses: ["A few candidates lack the preferred years of senior experience", "Some candidates may require onboarding for specific internal tools"],
        questions: [
          `What specific technical challenges are most critical for this cohort to address?`,
          `How can we differentiate the top 3 candidates during a technical panel interview?`,
          `What standardized culture-fit questions should we ask this entire group?`
        ]
      });
    }, 2500);
  };

  const groupedShortlisted = shortlistedCandidates.reduce((acc, app) => {
    if (!acc[app.job_title]) acc[app.job_title] = [];
    acc[app.job_title].push(app);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <HRLayout>
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="hr-overview-container">
        <div className="overview-banner">
          <div className="overview-banner-text">
            <span className="overview-banner-pill">Overview</span>
            <h2>Welcome back, HR!</h2>
            <p>Here is a quick snapshot of your recruitment progress today.</p>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card clickable" onClick={() => navigate("/hr/jobs")}>
            <div className="metric-icon blue">
              <WorkOutlineIcon />
            </div>
            <div className="metric-info">
              <h3>Total Jobs</h3>
              <h2>{stats.totalJobs}</h2>
              <p className="metric-subtext"><span className="positive">{stats.openJobs}</span> currently open</p>
            </div>
          </div>
          
          <div className="metric-card clickable" onClick={() => navigate("/hr/applications")}>
            <div className="metric-icon green">
              <DescriptionOutlinedIcon />
            </div>
            <div className="metric-info">
              <h3>Applications</h3>
              <h2>{stats.totalApplications}</h2>
              <p className="metric-subtext">Across all jobs</p>
            </div>
          </div>

          <div className="metric-card clickable" onClick={() => setShowShortlistedModal(true)}>
            <div className="metric-icon purple">
              <ThumbUpAltOutlinedIcon />
            </div>
            <div className="metric-info">
              <h3>Shortlisted</h3>
              <h2>{stats.shortlistedApplications}</h2>
              <p className="metric-subtext">Candidates ready for review</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon orange">
              <TrendingUpIcon />
            </div>
            <div className="metric-info">
              <h3>Avg AI Score</h3>
              <h2>84%</h2>
              <p className="metric-subtext">Matching accuracy</p>
            </div>
          </div>
        </div>

        <div className="recent-activity-section">
          <h3>Recently Posted Jobs</h3>
          {stats.recentJobs.length === 0 ? (
            <p className="no-data-text">No jobs posted yet.</p>
          ) : (
            <div className="recent-jobs-list">
              {stats.recentJobs.map(job => (
                <div key={job.id} className="recent-job-row">
                  <div className="recent-job-details">
                    <h4>{job.title}</h4>
                    <span>{job.company} • {job.location}</span>
                  </div>
                  <div className={`status-badge ${job.is_active ? 'active' : 'closed'}`}>
                    {job.is_active ? 'Open' : 'Closed'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shortlisted Modal */}
      {showShortlistedModal && (
        <div className="modal-overlay-premium">
          <div className="modal-premium-large shortlisted-modal">
            <div className="modal-header-premium">
              <div className="modal-title-group">
                <div className="modal-icon-container purple">
                  <ThumbUpAltOutlinedIcon />
                </div>
                <div className="modal-title-text">
                  <h2>Shortlisted Candidates</h2>
                  <p>Review your top talent grouped by job posting.</p>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => { setShowShortlistedModal(false); setDeepScreenJob(null); setExpandedCandidateId(null); }}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-content-scroll">
              {Object.keys(groupedShortlisted).length === 0 ? (
                <div className="no-data-text" style={{ padding: '2rem', textAlign: 'center' }}>No shortlisted candidates yet.</div>
              ) : (
                <div className="shortlisted-jobs-list">
                  {Object.entries(groupedShortlisted).map(([jobTitle, candidates]) => (
                    <div key={jobTitle} className="shortlisted-job-group">
                      <div className="shortlisted-job-header">
                        <h3 className="shortlisted-job-title">{jobTitle} <span className="count-badge">{candidates.length}</span></h3>
                        <button 
                          className="btn-deep-screen job-level-screen"
                          onClick={() => handleJobDeepScreen(jobTitle, candidates)}
                        >
                          <PsychologyIcon /> Deep AI Screen Cohort
                        </button>
                      </div>
                      <div className="shortlisted-candidates-grid">
                        {candidates.map(candidate => (
                          <div 
                            key={candidate.id} 
                            className={`shortlisted-candidate-card ${expandedCandidateId === candidate.id ? 'expanded' : ''}`}
                            onClick={() => setExpandedCandidateId(expandedCandidateId === candidate.id ? null : candidate.id)}
                          >
                            <div className="candidate-basic-info">
                              <div className="candidate-avatar">
                                {candidate.parsed_name ? candidate.parsed_name.charAt(0) : <PersonOutlineIcon />}
                              </div>
                              <div className="candidate-details">
                                <h4>{candidate.parsed_name || "Unknown Candidate"}</h4>
                                <span className="ai-score-badge">AI Score: {candidate.ai_score || 0}%</span>
                              </div>
                            </div>
                            
                            {expandedCandidateId === candidate.id && (
                              <div className="candidate-expanded-details" onClick={(e) => e.stopPropagation()}>
                                <div className="detail-section">
                                  <h5>AI Analysis Comments</h5>
                                  <div className="ai-explanation">
                                    {Array.isArray(candidate.match_explanation) ? (
                                      <ul>
                                        {candidate.match_explanation.map((exp, i) => <li key={i}>{exp}</li>)}
                                      </ul>
                                    ) : (
                                      <p>{candidate.match_explanation || "No AI comments available."}</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="detail-row">
                                  <div className="detail-section">
                                    <h5>Skills</h5>
                                    <p>{Array.isArray(candidate.parsed_skills) ? candidate.parsed_skills.join(", ") : (candidate.parsed_skills || "Not specified")}</p>
                                  </div>
                                  <div className="detail-section">
                                    <h5>Experience</h5>
                                    <p>{candidate.parsed_experience} years</p>
                                  </div>
                                </div>

                                <div className="detail-row">
                                  <div className="detail-section">
                                    <h5>Education</h5>
                                    <p>{candidate.parsed_education || "Not specified"}</p>
                                  </div>
                                  <div className="detail-section">
                                    <h5>Certifications</h5>
                                    <p>{candidate.parsed_certifications || "None"}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deep Screen Overlay */}
      {deepScreenJob && (
        <div className="deep-screen-overlay">
          <div className="deep-screen-panel">
            <div className="panel-header">
              <h3><PsychologyIcon /> AI Cohort Screening</h3>
              <button className="btn-close-modal" onClick={() => setDeepScreenJob(null)}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="panel-content">
              <h4>Job: {deepScreenJob.title}</h4>
              <p className="job-ref">Analyzing cohort of {deepScreenJob.count} shortlisted candidates</p>
              
              {isScreening ? (
                <div className="screening-loading">
                  <div className="spinner"></div>
                  <p>AI is analyzing resume depth, skill alignment, and generating custom interview questions...</p>
                </div>
              ) : screeningReport ? (
                <div className="screening-report">
                  <div className="report-section strengths">
                    <h5>Key Strengths Identified</h5>
                    <ul>
                      {screeningReport.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="report-section weaknesses">
                    <h5>Potential Risk Areas</h5>
                    <ul>
                      {screeningReport.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div className="report-section questions">
                    <h5>Recommended Panel Questions</h5>
                    <ol>
                      {screeningReport.questions.map((q, i) => <li key={i}>{q}</li>)}
                    </ol>
                  </div>
                  <button className="btn-modal-primary full-width" onClick={() => alert("Mock: Sending assessment invitations to cohort!")}>
                    Send Technical Assessment Invites
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </HRLayout>
  );
};

export default HROverview;
