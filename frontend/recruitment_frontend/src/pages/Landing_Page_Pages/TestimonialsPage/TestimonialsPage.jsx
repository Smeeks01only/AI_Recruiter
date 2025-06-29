// src/pages/TestimonialsPage/TestimonialsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./TestimonialsPage.css";

const testimonials = [
  {
    name: "Sarah K., HR Manager",
    quote:
      "AI Recruit reduced our hiring time by more than half and helped us find top-quality talent!",
  },
  {
    name: "James M., Software Engineer",
    quote:
      "Applying through AI Recruit was the smoothest job application process I've experienced.",
  },
  {
    name: "Amina P., Tech Recruiter",
    quote:
      "The bias detection and explainability features are a game-changer for inclusive hiring.",
  },
];

function TestimonialsPage() {
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
        <h1>What Our Users Say</h1>
        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div className="testimonial-card" key={index}>
              <p>"{t.quote}"</p>
              <h4>- {t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TestimonialsPage;
