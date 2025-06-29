// src/pages/TermsPage/TermsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./TermsPage.css";

function TermsPage() {
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
        <h1>Terms and Conditions</h1>
        <p>
          By using AI Recruit, you agree to use our services responsibly and not
          engage in activities that compromise system integrity or user privacy.
        </p>
        <h2>Usage</h2>
        <p>
          This platform is intended for lawful recruitment purposes only.
          Violation may result in account suspension or legal action.
        </p>
      </div>
    </>
  );
}

export default TermsPage;
