import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import "./ModelManager.css";

const ModelManager = () => {
  const [lastTrained, setLastTrained] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL = "http://127.0.0.1:8000/api/ai_engine";
  const API_STATUS_URL = `${API_BASE_URL}/status/`;
  const API_RETRAIN_URL = `${API_BASE_URL}/retrain/`;

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
    <div className="model-manager">
      <h3>🧠 AI Model Management</h3>
      <div className="model-info">
        <p>
          <strong>Model:</strong> Resume Scorer
        </p>
        <p className="last-trained">
          <strong>Last Trained:</strong> {lastTrained || "Loading..."}
          <button
            className="refresh-btn"
            onClick={fetchLastTrainedDate}
            title="Refresh Status"
          >
            <RefreshIcon fontSize="small" />
          </button>
        </p>
      </div>

      <button
        className="retrain-button"
        onClick={handleRetrain}
        disabled={isTraining}
      >
        {isTraining ? (
          <>
            <AutorenewIcon className="spin-icon" />
            Sending Request...
          </>
        ) : (
          "Retrain Model"
        )}
      </button>

      {message && (
        <p className="feedback-message success">
          <CheckCircleIcon fontSize="small" style={{ marginRight: "5px" }} />
          {message}
        </p>
      )}
      {error && (
        <p className="feedback-message error">
          <ErrorIcon fontSize="small" style={{ marginRight: "5px" }} />
          {error}
        </p>
      )}
    </div>
  );
};

export default ModelManager;
