// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

// Import Material UI Icons
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
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
      const profileRes = await fetch("http://127.0.0.1:8000/api/users/me/", {
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
          <div className="auth-header">
            <Link to="/" className="back-link">
              <ArrowBackIcon className="back-icon" />
              <span>Back to Home</span>
            </Link>
            <div className="auth-logo">
              <span className="logo-text">The Item</span>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to access your account</p>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form_group">
              <label htmlFor="username">Username</label>
              <div className="input-group">
                <div className="input-icon">
                  <PersonOutlineIcon />
                </div>
                <span> </span>
                <input
                  id="username"
                  type="text"
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
                <div className="input-icon">
                  <LockOutlinedIcon />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="form-actions">
              <div className="remember-forgot">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>
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
              <Link to="/register" className="register-link">
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
