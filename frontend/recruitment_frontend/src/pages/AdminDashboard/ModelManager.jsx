import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
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
    <div className="model-manager-container">
      <h2>🧠 AI Model Management</h2>
      <div className="model-info">
        <p>
          <strong>Model:</strong> Resume Scorer
        </p>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <strong>Last Trained:</strong> {lastTrained || "Loading..."}
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6bff', display: 'flex', alignItems: 'center' }}
            onClick={fetchLastTrainedDate}
            title="Refresh Status"
          >
            <RefreshIcon fontSize="small" />
          </button>
        </p>
      </div>

      <button
        className="retrain-btn"
        onClick={handleRetrain}
        disabled={isTraining}
      >
        {isTraining ? "Sending Request..." : "Retrain Model"}
      </button>

      {message && (
        <p className="status-message">
          <CheckCircleIcon fontSize="small" style={{ marginRight: "5px", verticalAlign: "middle" }} />
          {message}
        </p>
      )}
      {error && (
        <p className="status-message" style={{color: '#dc2626', background: '#fef2f2', borderColor: '#fecaca'}}>
          <ErrorIcon fontSize="small" style={{ marginRight: "5px", verticalAlign: "middle" }} />
          {error}
        </p>
      )}
    </div>
  );
};

export default ModelManager;
