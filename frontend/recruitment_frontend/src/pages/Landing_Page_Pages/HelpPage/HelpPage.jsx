// src/pages/HelpPage/HelpPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./HelpPage.css";

function HelpPage() {
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
        <h1>Help Center</h1>
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li>
            <strong>How do I register?</strong> <br />
            Click the "Get Started" button and fill in your details.
          </li>
          <li>
            <strong>Is AI Recruit free to use?</strong> <br />
            We offer a free version with optional premium upgrades.
          </li>
          <li>
            <strong>How is bias reduced?</strong> <br />
            We use FAIRLABEL and anonymized screening to minimize bias.
          </li>
        </ul>
      </div>
    </>
  );
}

export default HelpPage;
