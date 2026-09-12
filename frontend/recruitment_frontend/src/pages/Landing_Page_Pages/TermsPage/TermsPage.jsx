// src/pages/TermsPage/TermsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../../../components/Navbar/LandingNavbar";
import "./TermsPage.css";

function TermsPage() {
  return (
    <>
      {/* Header */}
      <LandingNavbar />

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
