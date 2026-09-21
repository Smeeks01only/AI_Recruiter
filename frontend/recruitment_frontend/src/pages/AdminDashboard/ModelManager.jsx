import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import MemoryIcon from "@mui/icons-material/Memory";
import "./ModelManager.css";
import API_BASE_URL from "../../config";

const ModelManager = () => {
  const [lastTrained, setLastTrained] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = `${API_BASE_URL}/api/ai_engine`;
  const API_STATUS_URL = `${API_URL}/status/`;
  const API_RETRAIN_URL = `${API_URL}/retrain/`;

  const fetchLastTrainedDate = useCallback(async () => {
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
      }
      const response = await axios.get(API_STATUS_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (
        response.data.last_trained &&
        response.data.last_trained !== "Unknown"
      ) {
        const date = new Date(response.data.last_trained);
        setLastTrained(date.toLocaleString());
      } else {
        setLastTrained("Unknown");
      }
    } catch (err) {
      console.error("Fetch status error:", err);
      const errorMsg =
        err.response?.data?.detail ||
        "Could not fetch model status. Check permissions.";
      setError(errorMsg);
    }
  }, []);

  useEffect(() => {
    fetchLastTrainedDate();
  }, [fetchLastTrainedDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleRetrain = async () => {
    setIsTraining(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsTraining(false);
        return;
      }
      const response = await axios.post(
        API_RETRAIN_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message || "Request sent successfully.");
      setTimeout(() => {
        fetchLastTrainedDate();
      }, 30000);
    } catch (err) {
      console.error("Retrain error:", err);
      const errorMessage =
        err.response?.data?.detail ||
        "Failed to start retraining model. Check permissions.";
      setError(errorMessage);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="ai-engine-card">
      <div className="ai-engine-icon-wrapper brand-bg border-brand">
        <MemoryIcon className="ai-engine-icon text-brand" fontSize="large" />
      </div>
      
      <h2 className="ai-engine-card-title">
        AI Model Management
      </h2>
      
      <div className="ai-engine-details">
        <div className="ai-engine-detail-row">
          <span className="detail-label">Model</span>
          <span className="detail-value">Resume Scorer</span>
        </div>
        <div className="ai-engine-detail-row">
          <span className="detail-label">Last Trained</span>
          <span className="detail-value flex-center-gap">
            {lastTrained || "Loading..."}
            <button onClick={fetchLastTrainedDate} className="refresh-icon-btn" title="Refresh Status">
              <RefreshIcon fontSize="small" />
            </button>
          </span>
        </div>
      </div>
      
      <button
        className="ai-engine-btn btn-outline"
        onClick={handleRetrain}
        disabled={isTraining}
      >
        <AutorenewIcon fontSize="small" />
        {isTraining ? "Sending Request..." : "Retrain Model"}
      </button>

      {message && (
        <p className="ai-status-msg success">
          <CheckCircleIcon fontSize="small" />
          {message}
        </p>
      )}
      {error && (
        <p className="ai-status-msg error">
          <ErrorIcon fontSize="small" />
          {error}
        </p>
      )}
    </div>
  );
};

export default ModelManager;
