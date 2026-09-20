// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

// Import Material UI Icons
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import API_BASE_URL from "../../config";
import logoUrl from "../../assets/logo.svg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed response:", data);
        throw new Error(data.detail || "Invalid credentials");
      }

      const { access, refresh } = data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Get user profile
      const profileRes = await fetch(`${API_BASE_URL}/api/users/me/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const user = await profileRes.json();

      if (!profileRes.ok) {
        console.error("Failed to fetch user profile:", user);
        throw new Error("Failed to get user profile");
      }

      localStorage.setItem("userRole", user.role);

      // Role-based navigation
      if (user.role === "candidate") {
        navigate("/candidate/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "hr") {
        navigate("/hr/dashboard");
      } else {
        navigate("/not-authorized");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(
        err.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <Link to="/" className="back-link">
            <ArrowBackIcon className="back-icon" />
            <span>Back to Home</span>
          </Link>
          <div className="auth-header">
            <Link to="/" className="auth-logo" style={{ textDecoration: 'none', alignItems: 'center' }}>
              <img src={logoUrl} alt="AI Recruit Logo" style={{ width: "1.75rem", height: "1.75rem", marginRight: "0.5rem" }} />
              <span className="logo-text">AI Recruit</span>
            </Link>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to access your account</p>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form_group">
              <label htmlFor="username">Username</label>
              <div className="input-group">
                <PersonOutlineIcon className="input-icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <LockOutlinedIcon className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <div className="checkbox-container">
                  <input type="checkbox" className="checkbox-custom" />
                  <CheckIcon className="checkbox-icon" fontSize="small" />
                </div>
                <span className="remember-text">Remember me</span>
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className={`auth-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <LoginIcon className="button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-redirect-link">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
