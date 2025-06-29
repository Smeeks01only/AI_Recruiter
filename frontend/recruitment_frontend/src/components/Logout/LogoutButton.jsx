// src/components/LogoutButton/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutButton.css"; // Import your CSS for styling

// Import a Material UI Icon for consistency
import LogoutIcon from "@mui/icons-material/Logout";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear all authentication data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");

    // Optional: You could also inform the backend API about the logout if needed
    // await fetch("http://127.0.0.1:8000/api/users/logout/", { method: 'POST', ... });

    // 2. Redirect the user to the login page (or homepage)
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      {" "}
      {/* Add a class for styling */}
      <LogoutIcon style={{ marginRight: "8px" }} />
      Logout
    </button>
  );
}

export default LogoutButton;
