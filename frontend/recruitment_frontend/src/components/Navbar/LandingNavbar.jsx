import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoUrl from "../../assets/logo.svg";
import "./LandingNavbar.css";

const LandingNavbar = () => {
  return (
    <header className="header">
      <Link to="/" className="logo" style={{ textDecoration: "none" }}>
        <img src={logoUrl} alt="AI Recruit Logo" style={{ width: "1.75rem", height: "1.75rem", marginRight: "0.5rem" }} />
        <span>AI Recruit</span>
      </Link>
      <nav className="nav-links">
        <a href="/#features" className="nav-link">
          Features
        </a>
        <a href="/#about" className="nav-link">
          About
        </a>
        <Link to="/login" className="nav-login-btn">
          Sign In
        </Link>
      </nav>
    </header>
  );
};

export default LandingNavbar;
