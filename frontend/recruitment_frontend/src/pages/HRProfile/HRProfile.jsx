import React, { useEffect, useState } from "react";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import HRNavbar from "../../components/Navbar/HRNavbar";
import "./HRProfile.css";

const HRProfile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role: "",
    bio: "",
    phone: "",
    country: "",
    city: "",
  });
  const [editing, setEditing] = useState({
    header: false,
    personal: false,
    address: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      if (error.response) {
        console.error(
          "Error fetching profile:",
          error.response.status,
          error.response.data
        );
      } else {
        console.error("Error fetching profile:", error.message);
      }
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (section) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put("http://127.0.0.1:8000/api/users/me/", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditing({ ...editing, [section]: false });
    } catch (error) {
      if (error.response) {
        console.error(
          "Error updating profile:",
          error.response.status,
          error.response.data
        );
      } else {
        console.error("Error updating profile:", error.message);
      }
    }
  };

  const handleCancel = (section) => {
    setEditing({ ...editing, [section]: false });
    fetchProfile(); // Refresh data to cancel changes
  };

  return (
    <div className="hr_profile_container">
      <HRNavbar />
      <div className="profile-wrapper">
        <h1 className="page-title">My Profile</h1>

        {/* Profile Header Card */}
        <div className="profile-card">
          <div className="card-header">
            <div className="profile-info">
              <div className="avatar">
                <img
                  src={"https://api.dicebear.com/7.x/pixel-art/svg/seed123"}
                  alt="Profile"
                />
              </div>
              <div className="profile-details">
                {editing.header ? (
                  <>
                    <input
                      type="text"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="name-input"
                    />
                    <input
                      type="text"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="name-input"
                    />
                  </>
                ) : (
                  <h2 className="profile-name">
                    {profile.first_name} {profile.last_name}
                  </h2>
                )}
                <p className="profile-role">{profile.role.toUpperCase()}</p>
                <p className="profile-location">
                  {/* {profile.city && profile.country
                    ? `${profile.city}, ${profile.country}`
                    : "Location not provided"} */}
                  No Location
                </p>
              </div>
            </div>
            <div className="edit-actions">
              {editing.header ? (
                <div className="action-buttons">
                  <button
                    className="save-btn small"
                    onClick={() => handleSave("header")}
                  >
                    <span className="material-icons">
                      <CheckIcon />
                    </span>
                  </button>
                  <button
                    className="cancel-btn small"
                    onClick={() => handleCancel("header")}
                  >
                    <span className="material-icons">
                      <CloseIcon />
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  className="edit-btn-icon"
                  onClick={() => setEditing({ ...editing, header: true })}
                >
                  <span className="material-icons">
                    <EditIcon />
                  </span>
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="profile-card">
          <div className="card-header">
            <h3 className="section-title">Personal Information</h3>
            <div className="edit-actions">
              {editing.personal ? (
                <div className="action-buttons">
                  <button
                    className="save-btn small"
                    onClick={() => handleSave("personal")}
                  >
                    <span className="material-icons">
                      <CheckIcon />
                    </span>
                  </button>
                  <button
                    className="cancel-btn small"
                    onClick={() => handleCancel("personal")}
                  >
                    <span className="material-icons">
                      <CloseIcon />
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  className="edit-btn-icon"
                  onClick={() => setEditing({ ...editing, personal: true })}
                >
                  <span className="material-icons">
                    <EditIcon />
                  </span>
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="field-label">First Name</label>
              {editing.personal ? (
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p className="field-value">{profile.first_name}</p>
              )}
            </div>

            <div className="form-group">
              <label className="field-label">Last Name</label>
              {editing.personal ? (
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <p className="field-value">{profile.last_name}</p>
              )}
            </div>

            <div className="form-group">
              <label className="field-label">Email Address</label>
              <p className="field-value">{profile.email}</p>
            </div>

            <div className="form-group">
              <label className="field-label">Phone</label>
              {editing.personal ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="field-value">
                  {/*profile.phone || "Not provided"*/}No number
                </p>
              )}
            </div>

            <div className="form-group full-width">
              <label className="field-label">Role</label>
              <p className="field-value">{profile.role.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="profile-card">
          <div className="card-header">
            <h3 className="section-title">Address</h3>
            <div className="edit-actions">
              {editing.address ? (
                <div className="action-buttons">
                  <button
                    className="save-btn small"
                    onClick={() => handleSave("address")}
                  >
                    <span className="material-icons">
                      <CheckIcon />
                    </span>
                  </button>
                  <button
                    className="cancel-btn small"
                    onClick={() => handleCancel("address")}
                  >
                    <span className="material-icons">
                      <CloseIcon />
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  className="edit-btn-icon"
                  onClick={() => setEditing({ ...editing, address: true })}
                >
                  <span className="material-icons">
                    <EditIcon />
                  </span>
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="field-label">Country</label>
              {editing.address ? (
                <input
                  type="text"
                  name="country"
                  value={profile.country || ""}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter country"
                />
              ) : (
                <p className="field-value">
                  {/*profile.country || "Not provided"*/} N/A
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="field-label">City/State</label>
              {editing.address ? (
                <input
                  type="text"
                  name="city"
                  value={profile.city || ""}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter city/state"
                />
              ) : (
                <p className="field-value">
                  {/*profile.city || "Not provided"*/} N/A
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRProfile;
