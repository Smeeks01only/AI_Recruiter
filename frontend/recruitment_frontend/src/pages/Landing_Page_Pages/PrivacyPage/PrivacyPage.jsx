// src/pages/PrivacyPage/PrivacyPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../../../components/Navbar/LandingNavbar";
import "./PrivacyPage.css";

function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <LandingNavbar />

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
