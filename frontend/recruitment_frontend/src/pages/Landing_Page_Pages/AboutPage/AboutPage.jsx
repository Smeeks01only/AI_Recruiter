// src/pages/AboutPage/AboutPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../../../components/Navbar/LandingNavbar";
import "./AboutPage.css";

function AboutPage() {
  return (
    <>
      {/* Header */}
      <LandingNavbar />

      {/* Page Content */}
      <div className="page-container">
        <h1>About AI Recruit</h1>
        <p>
          AI Recruit is a modern recruitment platform designed to streamline the
          hiring process through intelligent automation. Built with fairness,
          speed, and accuracy in mind, our system helps employers find the right
          candidates faster while ensuring transparency and bias reduction.
        </p>
        <h2>Our Mission</h2>
        <p>
          To revolutionize the hiring experience for both employers and job
          seekers by leveraging the power of artificial intelligence and ethical
          data practices.
        </p>
        <h2>Our Vision</h2>
        <p>
          A world where hiring decisions are data-driven, inclusive, and truly
          merit-based.
        </p>
      </div>
    </>
  );
}

export default AboutPage;
