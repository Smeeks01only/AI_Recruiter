import React, { useState, useEffect } from "react";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CandidatesNavbar from "../../components/Navbar/CandidatesNavbar";
import "./CandidateProfile.css";
import API_BASE_URL from "../../config";

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${API_BASE_URL}/api/users/me/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
        setBio(response.data.bio || "");
        setLoading(false);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${API_BASE_URL}/api/users/${profile.id}/`,
        { bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile({ ...profile, bio });
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setBio(profile.bio || "");
    setIsEditing(false);
  };

  const getInitials = (username) => {
    if (!username) return "U";
    return username.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="candidate_profile_container">
        <CandidatesNavbar />
        <main className="candidate-profile-main">
          <div className="loading-container">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="candidate_profile_container">
      <CandidatesNavbar />
      <main className="candidate-profile-main">
        {/* Page Header */}
        <div className="profile-page-header">
          <button onClick={() => navigate(-1)} className="back-btn shrink-0">
            <ArrowBackIcon fontSize="small" /> Back
          </button>
          <h1 className="profile-page-title">
            My Profile
          </h1>
        </div>

        {/* Profile Cards Container */}
        <div className="profile-cards-wrapper">
          
          {/* Card 1: Profile Header */}
          <div className="profile-card-modern profile-header-modern">
            {/* Avatar */}
            <div className="profile-avatar-modern">
              {getInitials(profile?.username)}
            </div>
            
            {/* User Details */}
            <div className="profile-details-modern">
              <h2 className="profile-name-modern">
                {profile?.username || "User"}
                {/* Meta Info Row */}
                <div className="profile-meta-modern">
                  <div className="meta-item">
                    <WorkIcon className="meta-icon" fontSize="small" />
                    {profile?.role || "candidate"}
                  </div>
                  <div className="meta-item">
                    <EmailIcon className="meta-icon" fontSize="small" />
                    {profile?.email}
                  </div>
                </div>
              </h2>
            </div>
          </div>

          {/* Card 2: Personal Information */}
          <div className="profile-card-modern">
            <div className="card-header-modern">
              <PersonIcon className="card-header-icon" />
              <h3 className="card-title-modern">Personal Information</h3>
            </div>
            
            <div className="info-grid-modern">
              <div>
                <p className="info-label-modern">Username</p>
                <p className="info-value-modern">{profile?.username}</p>
              </div>
              
              <div>
                <p className="info-label-modern">Role</p>
                <p className="info-value-modern">{profile?.role || "candidate"}</p>
              </div>
              
              <div className="info-full-width">
                <p className="info-label-modern">Email Address</p>
                <p className="info-value-modern">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Card 3: Bio */}
          <div className="profile-card-modern">
            {/* Header & Action */}
            <div className="bio-header-modern">
              <div className="card-header-modern" style={{ marginBottom: 0 }}>
                <EditIcon className="card-header-icon" />
                <h3 className="card-title-modern">Bio</h3>
              </div>
              
              {!isEditing && (
                <button className="edit-btn-modern" onClick={() => setIsEditing(true)}>
                  <EditIcon className="btn-icon" fontSize="small" />
                  Edit
                </button>
              )}
            </div>
            
            {/* Divider */}
            <div className="card-divider-modern"></div>
            
            {/* Content */}
            <div className="bio-content-modern">
              {isEditing ? (
                <>
                  <textarea
                    className="bio-textarea-modern"
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="bio-actions-modern">
                    <button className="save-btn-modern" onClick={handleUpdate}>
                      <SaveIcon className="btn-icon" fontSize="small" />
                      Save Changes
                    </button>
                    <button className="cancel-btn-modern" onClick={handleCancel}>
                      <CloseIcon fontSize="small" />
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="bio-display-modern">
                  {bio ? (
                    <p className="bio-text-modern">{bio}</p>
                  ) : (
                    <p className="bio-placeholder-modern">
                      Young and curious... Click edit to add your bio.
                    </p>
                  )}
                </div>
              )}
              
              {success && (
                <div className="success-message-modern">
                  <CheckCircleIcon className="success-icon" fontSize="small" />
                  Bio updated successfully!
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CandidateProfile;
