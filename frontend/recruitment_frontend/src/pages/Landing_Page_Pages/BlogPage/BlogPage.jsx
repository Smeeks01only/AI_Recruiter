// src/pages/BlogPage/BlogPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../../../components/Navbar/LandingNavbar";
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
      <LandingNavbar />

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
