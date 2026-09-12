// src/components/LogoutButton/LogoutButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css"; // Import your CSS for styling

// Import a Material UI Icon for consistency
import LogoutIcon from "@mui/icons-material/Logout";
import API_BASE_URL from "../../config";

function LogoutButton() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  const handleConfirmLogout = () => {
    // 1. Clear all authentication data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");

    // Optional: You could also inform the backend API about the logout if needed
    // await fetch(`${API_BASE_URL}/api/users/logout/`, { method: 'POST', ... });

    // 2. Redirect the user to the login page (or homepage)
    navigate("/login");
  };

  return (
    <>
      <button onClick={handleLogoutClick} className="logout-button">
        {" "}
        {/* Add a class for styling */}
        <LogoutIcon style={{ marginRight: "8px" }} />
        Logout
      </button>

      {showModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2 className="logout-modal-title">Confirm Logout</h2>
            <p className="logout-modal-text">Are you sure you want to log out of your account?</p>
            <div className="logout-modal-actions">
              <button className="logout-modal-btn cancel" onClick={handleCancelLogout}>
                Cancel
              </button>
              <button className="logout-modal-btn confirm" onClick={handleConfirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LogoutButton;
