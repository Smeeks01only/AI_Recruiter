import React, { useState, useEffect } from "react";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CandidatesNavbar from "../../components/Navbar/CandidatesNavbar";
import "./CandidateProfile.css";

const CandidateProfile = () => {
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
          "http://127.0.0.1:8000/api/users/me/",
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
        `http://127.0.0.1:8000/api/users/${profile.id}/`,
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
        <div className="loading-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate_profile_container">
      <CandidatesNavbar />

      <div className="profile-wrapper">
        <h1 className="page-title">My Profile</h1>

        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="avatar">{getInitials(profile?.username)}</div>
          <div className="profile-info">
            <h2 className="profile-name">{profile?.username || "User"}</h2>
            <div className="profile-detail">
              <WorkIcon className="detail-icon" />
              <span>{profile?.role || "Role not specified"}</span>
            </div>
            <div className="profile-detail">
              <EmailIcon className="detail-icon" />
              <span>{profile?.email}</span>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="info-card">
          <h3 className="card-title">
            <PersonIcon className="title-icon" />
            Personal Information
          </h3>

          <div className="info-grid">
            <div className="info-section">
              <div className="info-item">
                <label className="info-label">Username</label>
                <p className="info-value">{profile?.username}</p>
              </div>

              <div className="info-item">
                <label className="info-label">Email Address</label>
                <p className="info-value">{profile?.email}</p>
              </div>
            </div>

            <div className="info-section">
              <div className="info-item">
                <label className="info-label">Role</label>
                <p className="info-value">{profile?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section Card */}
        <div className="info-card">
          <div className="card-header">
            <h3 className="card-title">
              <EditIcon className="title-icon" />
              Bio
            </h3>
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <EditIcon className="btn-icon" />
                Edit
              </button>
            )}
          </div>

          <div className="bio-section">
            {isEditing ? (
              <>
                <textarea
                  className="bio-textarea"
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
                <div className="bio-actions">
                  <button className="save-btn" onClick={handleUpdate}>
                    <SaveIcon className="btn-icon" />
                    Save Changes
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <CloseIcon />
                    <span>Cancel</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="bio-display">
                {bio ? (
                  <p className="bio-text">{bio}</p>
                ) : (
                  <p className="bio-placeholder">
                    No bio added yet. Click edit to add your bio.
                  </p>
                )}
              </div>
            )}

            {success && (
              <div className="success-message">
                <CheckCircleIcon className="success-icon" />
                Bio updated successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
