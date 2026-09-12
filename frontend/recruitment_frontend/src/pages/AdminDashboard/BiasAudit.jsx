import React, { useState } from "react";
import axios from "axios";
import "./BiasAudit.css";
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
    <div className="bias-audit-container">
      <h2>Bias Detection</h2>
      <button
        className="run-audit-btn"
        onClick={handleBiasCheck}
        disabled={loading}
      >
        {loading ? "Checking for Bias..." : "Run Bias Audit"}
      </button>

      {error && <p className="status-message" style={{color: '#dc2626', background: '#fef2f2', borderColor: '#fecaca'}}>{error}</p>}
      {biasResult && (
        <div className="audit-results">
          <h3>
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
