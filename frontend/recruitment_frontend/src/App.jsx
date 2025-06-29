import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import LandingPage from "./pages/LandingPage/LandingPage";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import DashboardCandidate from "./pages/DashboardCandidate/DashboardCandidate";
import DashboardHR from "./pages/DashboardHR/DashboardHR";
import CandidateProfile from "./pages/CandidateProfile/CandidateProfile";
import CandidateJobs from "./pages/CandidateJobs/CandidateJobs";
import CandidateApplications from "./pages/CandidateApplications/CandidateApplications";
import HRProfile from "./pages/HRProfile/HRProfile";
import HRApplications from "./pages/HRApplications/HRApplications";
import AdminProfile from "./pages/AdminProfile/AdminProfile";

// Landing Page pages
import AboutPage from "./pages/Landing_Page_Pages/AboutPage/AboutPage";
import BlogPage from "./pages/Landing_Page_Pages/BlogPage/BlogPage";
import HelpPage from "./pages/Landing_Page_Pages/HelpPage/HelpPage";
import PrivacyPage from "./pages/Landing_Page_Pages/PrivacyPage/PrivacyPage";
import TermsPage from "./pages/Landing_Page_Pages/TermsPage/TermsPage";
import TestimonialsPage from "./pages/Landing_Page_Pages/TestimonialsPage/TestimonialsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/hr/dashboard" element={<DashboardHR />} />
        {/* … existing routes … */}
        <Route path="/candidate/dashboard" element={<DashboardCandidate />} />
        {/* Placeholder routes for the pages to be built next */}
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/jobs" element={<CandidateJobs />} />
        <Route
          path="/candidate/applications"
          element={<CandidateApplications />}
        />
        <Route path="/hr/profile" element={<HRProfile />} />
        <Route path="/hr/applications" element={<HRApplications />} />
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* Landing Page specific routes */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Default route for unknown paths */}
        <Route
          path="*"
          element={<h1 style={{ padding: "4rem" }}>Page Not Found</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
