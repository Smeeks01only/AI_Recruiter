// src/pages/Register/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

// Import Material UI Icons
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "candidate",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Required fields validation
    if (!formData.first_name) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name) {
      newErrors.last_name = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...dataToSend } = formData;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle server validation errors
        if (data.username) {
          setErrors((prev) => ({ ...prev, username: data.username[0] }));
        }
        if (data.email) {
          setErrors((prev) => ({ ...prev, email: data.email[0] }));
        }
        if (data.password) {
          setErrors((prev) => ({ ...prev, password: data.password[0] }));
        }
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error("Registration failed. Please check your information.");
      }

      // Registration successful
      navigate("/login");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Registration failed. Please try again later.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="back-link">
              <ArrowBackIcon className="back-icon" />
              <span>Back to Home</span>
            </Link>
            <div className="auth-logo">
              <span className="logo-text">The Item</span>
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Complete the form below to get started
            </p>
          </div>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form register-form">
            <div className="form-row">
              <div className="form_group">
                <label htmlFor="first_name">First Name</label>
                <div className="input-group">
                  <div className="input-icon">
                    <BadgeOutlinedIcon />
                  </div>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.first_name && (
                  <span className="field-error">{errors.first_name}</span>
                )}
              </div>

              <div className="form_group">
                <label htmlFor="last_name">Last Name</label>
                <div className="input-group">
                  <div className="input-icon">
                    <BadgeOutlinedIcon />
                  </div>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.last_name && (
                  <span className="field-error">{errors.last_name}</span>
                )}
              </div>
            </div>

            <div className="form_group">
              <label htmlFor="username">Username</label>
              <div className="input-group">
                <div className="input-icon">
                  <PersonOutlineIcon />
                </div>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>

            <div className="form_group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <div className="input-icon">
                  <EmailOutlinedIcon />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form_group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <div className="input-icon">
                  <LockOutlinedIcon />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {/* <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button> */}
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
              <p className="password-hint">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="form_group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <div className="input-icon">
                  <LockOutlinedIcon />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form_group">
              <label htmlFor="role">Account Type</label>
              <div className="input-group select-group">
                <div className="input-icon">
                  <WorkOutlineIcon />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="candidate">Candidate / Job Seeker</option>
                  <option value="hr">HR Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="form_group">
              <label htmlFor="bio">Professional Bio (Optional)</label>
              <div className="input-group textarea-group">
                <div className="input-icon textarea-icon">
                  <DescriptionOutlinedIcon />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                ></textarea>
              </div>
            </div>

            <div className="terms-agreement">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>
                  I agree to the{" "}
                  <a href="/terms" className="terms-link">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="terms-link">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={`auth-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account <HowToRegIcon className="button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
