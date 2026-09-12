import React from "react";
import { Link } from "react-router-dom";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import "./LandingNavbar.css";

const LandingNavbar = () => {
  return (
    <header className="header">
      <Link to="/" className="logo" style={{ textDecoration: "none" }}>
        <ChangeHistoryIcon style={{ color: "#4a6bff", fontSize: "2rem" }} />
        <span>
          <span style={{ color: "var(--secondary-color)" }}>AI</span>
          <span className="logo-accent"> Recruit</span>
        </span>
      </Link>
      <nav className="nav-links">
        <a href="/#features" className="nav-link">
          Features
        </a>
        <a href="/#about" className="nav-link">
          About
        </a>
        <Link to="/login" className="nav-link login-link">
          Login
        </Link>
      </nav>
    </header>
  );
};

export default LandingNavbar;
