import React, { useState } from "react";
import axios from "axios";
import BalanceIcon from "@mui/icons-material/Balance";
import ShieldIcon from "@mui/icons-material/Shield";
import ErrorIcon from "@mui/icons-material/Error";
import "./ModelManager.css"; // Reuse shared ai-engine-card styles
import API_BASE_URL from "../../config";

const BiasAudit = () => {
  const [loading, setLoading] = useState(false);
  const [biasResult, setBiasResult] = useState(null);
  const [error, setError] = useState("");

  const handleBiasCheck = async () => {
    setLoading(true);
    setBiasResult(null);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/ai_engine/bias_report/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBiasResult(response.data);
    } catch (err) {
      console.error("Bias check error:", err);
      setError("Could not perform bias audit. Make sure you are an admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-engine-card">
      <div className="ai-engine-icon-wrapper indigo-bg border-indigo">
        <BalanceIcon className="ai-engine-icon text-indigo" fontSize="large" />
      </div>
      
      <h2 className="ai-engine-card-title">
        Bias Detection
      </h2>
      
      <p className="ai-engine-desc">
        Run comprehensive analytics on candidate matching algorithms to ensure fair, unbiased, and equitable recruitment outcomes.
      </p>
      
      <button
        className="ai-engine-btn btn-primary"
        onClick={handleBiasCheck}
        disabled={loading}
      >
        <ShieldIcon fontSize="small" />
        {loading ? "Checking for Bias..." : "Run Bias Audit"}
      </button>

      {error && <p className="ai-status-msg error"><ErrorIcon fontSize="small"/> {error}</p>}
      
      {biasResult && (
        <div className="ai-audit-results">
          <h3 className={biasResult.bias_detected ? "text-error" : "text-success"}>
            {biasResult.bias_detected ? "⚠️ Bias Detected" : "✅ No Bias Detected"}
          </h3>
          <p>
            {biasResult.details}
          </p>
        </div>
      )}
    </div>
  );
};

export default BiasAudit;
