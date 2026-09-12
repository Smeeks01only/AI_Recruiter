// src/pages/TestimonialsPage/TestimonialsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../../../components/Navbar/LandingNavbar";
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
      <LandingNavbar />

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
