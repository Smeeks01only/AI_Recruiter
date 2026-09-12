// src/pages/HelpPage/HelpPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../../../components/Navbar/LandingNavbar";
import "./HelpPage.css";

function HelpPage() {
  return (
    <>
      {/* Header */}
      <LandingNavbar />

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
