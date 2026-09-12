// src/pages/LandingPage/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import AI_Recruit from "../../assets/images/AI_Recruit.png";
import LandingNavbar from "../../components/Navbar/LandingNavbar";
import "./LandingPage.css";

// Import Material UI Icons
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SpeedIcon from "@mui/icons-material/Speed";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function LandingPage() {
  return (
    <div className="landing-container">
      <LandingNavbar />

      <main>
        <section className="hero-section">
          <div className="hero-background">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </div>
          <div className="hero-content">
            <div className="hero-badge">Next Generation ATS</div>
            <h1 className="title">
              Hire smarter with <br/> <span className="text-gradient">AI Recruit</span>
            </h1>
            <p className="subtitle">
              Transform your hiring process with intelligent automation, bias
              reduction, and data-driven candidate matching. Find the perfect fit, faster.
            </p>
            <div className="btn-group">
              <Link to="/register" className="btn primary btn-glow">
                Start Hiring Now <ArrowForwardIcon className="icon-right" />
              </Link>
              <div className="hero-trust">
                <CheckCircleOutlineIcon className="trust-icon" /> No credit card required
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder floating-effect">
              <div className="glass-overlay"></div>
              <img src={AI_Recruit} alt="AI Recruitment Interface" />
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <h2 className="landing-section-title">Why Choose AI Recruit</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <SpeedIcon />
              </div>
              <h3>Accelerated Hiring</h3>
              <p>
                Reduce time-to-hire by up to 70% with AI-powered candidate
                screening and automated workflows.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <EqualizerIcon />
              </div>
              <h3>Data-Driven Decisions</h3>
              <p>
                Make smarter hiring decisions with comprehensive analytics and
                predictive matching.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <SecurityIcon />
              </div>
              <h3>Reduce Bias</h3>
              <p>
                Our AI algorithms are designed to minimize unconscious bias in
                the recruitment process.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <PersonSearchIcon />
              </div>
              <h3>Perfect Match</h3>
              <p>
                Find candidates that truly fit your company culture and role
                requirements.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-top-gradient"></div>
        <div className="cta-section">
          <h2>Ready to transform your recruitment process?</h2>
          <Link to="/register" className="btn primary footer-cta">
            Get Started for Free
          </Link>
        </div>
        <div className="footer-links">
          <div className="footer-column brand-column">
            <div className="logo footer-logo">
              <ChangeHistoryIcon className="logo-icon" />
              <span className="logo-text">AI Recruit</span>
            </div>
            <p>The modern, intelligent applicant tracking system designed to help you build world-class teams.</p>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <Link to="/testimonials">Testimonials</Link>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} AI Recruit. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
