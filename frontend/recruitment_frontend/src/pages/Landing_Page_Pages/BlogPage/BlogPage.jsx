// src/pages/BlogPage/BlogPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BlogPage.css";

const posts = [
  {
    title: "How AI Is Transforming Recruitment",
    excerpt:
      "Explore how artificial intelligence is reshaping modern hiring...",
  },
  {
    title: "5 Hiring Biases You Didn't Know About",
    excerpt: "Understand hidden hiring biases and how to overcome them...",
  },
  {
    title: "The Future of Work: What's Next?",
    excerpt: "Remote work, automation, and upskilling: key trends ahead...",
  },
];

function BlogPage() {
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
          {/* <Link to="/" className="nav-link">
            Home
          </Link> */}
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
        <h1>AI Recruit Blog</h1>
        <div className="blog-grid">
          {posts.map((post, index) => (
            <div className="blog-card" key={index}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <a href="#">Read more →</a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BlogPage;
