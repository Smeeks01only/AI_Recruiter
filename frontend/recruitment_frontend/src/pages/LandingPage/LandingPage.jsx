// src/pages/LandingPage/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import AI_Recruit from "../../assets/images/AI_Recruit.png";
import "./LandingPage.css";

// Import Material UI Icons
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SpeedIcon from "@mui/icons-material/Speed";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">
          <span className="logo-text">AI Powered Recruitment System</span>
        </div>
        <nav className="nav-links">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          {/* <a href="#pricing" className="nav-link">
            Pricing
          </a> */}
          <Link to="/login" className="nav-link login-link">
            Login
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="title">AI Powered Recruitment System</h1>
            <p className="subtitle">
              Transform your hiring process with intelligent automation, bias
              reduction, and data-driven candidate matching. Streamline
              recruitment, enhance decision-making, and deliver a faster, fairer
              experience for both candidates and employers.
            </p>
            <div className="btn-group">
              <Link to="/register" className="btn primary">
                Get Started <ArrowForwardIcon className="icon-right" />
              </Link>
              {/* <Link to="/demo" className="btn secondary">
                See Demo
              </Link> */}
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <img src={AI_Recruit} alt="AI Recruitment" />
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <h2 className="section-title">Why Choose AI Recruit</h2>

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
        <div className="cta-section">
          <h2>Ready to transform your recruitment process?</h2>
          {/* <Link to="/register" className="btn primary">
            Start Free Trial
          </Link> */}
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <a href="/features">Features</a>
            {/* <a href="#pricing">Pricing</a> */}
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
          © {new Date().getFullYear()} The Item. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
