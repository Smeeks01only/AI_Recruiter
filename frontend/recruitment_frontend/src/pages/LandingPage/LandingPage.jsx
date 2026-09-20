// src/pages/LandingPage/LandingPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoUrl from "../../assets/logo.svg";
import "./LandingPage.css";

function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page-modern">
      {/* Background Blobs */}
      <div className="blob-bg blob-brand"></div>
      <div className="blob-bg blob-purple"></div>

      {/* Navigation Bar */}
      <header className="glass-nav-modern">
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo */}
            <Link to="/" className="logo-modern">
              <div className="logo-icon-container">
                <div className="logo-svg" style={{ WebkitMaskImage: `url(${logoUrl})`, maskImage: `url(${logoUrl})` }}></div>
              </div>
              <span className="logo-text-modern">AI Recruit</span>
            </Link>

            {/* Desktop Menu */}
            <nav className="desktop-menu">
              <a href="#features">Features</a>
              <a href="#solutions">Solutions</a>
              <a href="#pricing">Pricing</a>
              <a href="#resources">Resources</a>
            </nav>

            {/* CTA Buttons */}
            <div className="nav-cta-group">
              <Link to="/login" className="login-btn-modern">Log in</Link>
              <Link to="/register" className="start-free-btn">Start for free</Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="mobile-menu-btn">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="menu-icon"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="menu-icon"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#solutions" onClick={() => setIsMobileMenuOpen(false)}>Solutions</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <a href="#resources" onClick={() => setIsMobileMenuOpen(false)}>Resources</a>
            <div className="mobile-cta-group">
              <Link to="/login" className="login-btn-modern mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
              <Link to="/register" className="start-free-btn mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Start for free</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-main-modern">
        <div className="hero-container">
          <div className="hero-grid">
            
            {/* Left Column: Content */}
            <div className="hero-content-col animate-fade-in-up">
              <div className="status-badge">
                <span className="ping-dot-container">
                  <span className="ping-dot-animate"></span>
                  <span className="ping-dot"></span>
                </span>
                AI Recruit 2.0 is now live
              </div>
              
              <h1 className="hero-title-modern">
                Streamline your hiring with <br />
                <span className="text-gradient-modern">intelligent automation</span>
              </h1>
              
              <p className="hero-subtitle-modern">
                Connect your favorite tools, automate repetitive tasks, and focus on what truly matters. Build powerful workflows in minutes, without writing a single line of code.
              </p>
              
              <div className="hero-action-buttons">
                <Link to="/register" className="btn-primary-modern">
                  Get started for free
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
                <a href="#features" className="btn-secondary-modern">
                  <svg className="btn-icon-left" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                  View interactive demo
                </a>
              </div>
              
              <div className="social-proof">
                <div className="avatar-group">
                  <img src="https://i.pravatar.cc/100?img=1" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=2" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=3" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=4" alt="User" />
                </div>
                <p>Trusted by <span>10,000+</span> teams</p>
              </div>
            </div>
            
            {/* Right Column: App Mockup */}
            <div className="hero-mockup-col animate-fade-in-up delay-2">
              <div className="mockup-wrapper">
                <div className="mockup-glow"></div>
                
                <div className="mockup-window animate-float">
                  <div className="mockup-header">
                    <div className="mockup-dots">
                      <div className="dot red"></div>
                      <div className="dot yellow"></div>
                      <div className="dot green"></div>
                    </div>
                    <div className="mockup-url-bar">
                      <svg className="lock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      app.airecruit.io
                    </div>
                  </div>
                  
                  <div className="mockup-body">
                    <div className="mockup-layout">
                      <div className="mockup-sidebar">
                        <div className="skel-box h-8 mb-4"></div>
                        <div className="skel-line w-75 mt-4"></div>
                        <div className="skel-line w-85"></div>
                        <div className="skel-line w-100"></div>
                        <div className="skel-line w-65"></div>
                        <div className="skel-line w-80 mt-8"></div>
                        <div className="skel-line w-100"></div>
                      </div>
                      
                      <div className="mockup-main">
                        <div className="mockup-topbar">
                          <div>
                            <div className="skel-box h-6 w-48 mb-2"></div>
                            <div className="skel-line w-64"></div>
                          </div>
                          <div className="skel-box h-8 w-24 rounded-full brand-100"></div>
                        </div>
                        
                        <div className="mockup-stats">
                          <div className="skel-stat-card">
                            <div className="skel-circle blue"></div>
                            <div className="skel-line w-50"></div>
                          </div>
                          <div className="skel-stat-card">
                            <div className="skel-circle purple"></div>
                            <div className="skel-line w-65"></div>
                          </div>
                          <div className="skel-stat-card">
                            <div className="skel-circle green"></div>
                            <div className="skel-line w-35"></div>
                          </div>
                        </div>
                        
                        <div className="mockup-graph">
                          <div className="graph-gradient"></div>
                          <div className="graph-bars">
                            <div className="bar brand-200 h-30"></div>
                            <div className="bar brand-300 h-50"></div>
                            <div className="bar brand-200 h-40"></div>
                            <div className="bar brand-400 h-80"></div>
                            <div className="bar brand-500 h-60"></div>
                            <div className="bar brand-400 h-90"></div>
                            <div className="bar brand-300 h-70"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mockup-badge">
                    <div className="badge-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div className="badge-text">
                      <p className="badge-title">Workflow Active</p>
                      <p className="badge-time">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section-modern" id="features">
        <div className="features-container">
          <div className="features-header">
            <h2>Why Choose AI Recruit</h2>
          </div>
          
          <div className="features-grid-modern">
            <div className="feature-card-modern group">
              <div className="feature-icon-modern">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3>Accelerated Hiring</h3>
              <p>Reduce time-to-hire by up to 70% with AI-powered candidate screening and automated workflows.</p>
            </div>

            <div className="feature-card-modern group">
              <div className="feature-icon-modern">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3>Data-Driven Decisions</h3>
              <p>Make smarter hiring decisions with comprehensive analytics and predictive matching.</p>
            </div>

            <div className="feature-card-modern group">
              <div className="feature-icon-modern">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3>Reduce Bias</h3>
              <p>Our AI algorithms are designed to minimize unconscious bias in the recruitment process.</p>
            </div>

            <div className="feature-card-modern group">
              <div className="feature-icon-modern">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3>Perfect Match</h3>
              <p>Find candidates that truly fit your company culture and role requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-modern">
        <div className="footer-container">
          <div className="footer-cta-box">
            <h2>Ready to transform your recruitment process?</h2>
            <Link to="/register" className="btn-white-modern">Get Started for Free</Link>
          </div>
          
          <div className="footer-layout">
            <div className="footer-brand-col">
              <div className="footer-logo-modern">
                <div className="logo-svg" style={{ WebkitMaskImage: `url(${logoUrl})`, maskImage: `url(${logoUrl})` }}></div>
                <span>AI Recruit</span>
              </div>
              <p>The modern, intelligent applicant tracking system designed to help you build world-class teams.</p>
            </div>
            
            <div className="footer-links-grid">
              <div className="footer-link-col">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Blog</a>
              </div>
              <div className="footer-link-col">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Testimonials</a>
              </div>
              <div className="footer-link-col">
                <h4>Resources</h4>
                <a href="#">Help Center</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
