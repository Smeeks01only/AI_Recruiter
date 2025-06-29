// src/pages/PrivacyPage/PrivacyPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./PrivacyPage.css";

function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <Link to="/" className="nav-link">
            <span className="logo-text">AI Recruit</span>
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/blog" className="nav-link">
            Blog
          </Link>
          <Link to="/testimonials" className="nav-link">
            Testimonials
          </Link>
          <Link to="/help" className="nav-link">
            Help
          </Link>
          <Link to="/login" className="nav-link login-link">
            Login
          </Link>
        </nav>
      </header>

      {/* Page Content */}
      <div className="page-container">
        <h1>Privacy Policy</h1>
        <p>
          We value your privacy. AI Recruit collects minimal data necessary to
          provide its services. All data is stored securely and is never shared
          with third parties without consent.
        </p>
        <h2>Data Usage</h2>
        <p>
          Data is used solely for recruitment matching, analytics, and improving
          our services. You may request data deletion at any time.
        </p>
      </div>
    </>
  );
}

export default PrivacyPage;
