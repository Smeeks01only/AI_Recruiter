import React, { useState } from "react";
import axios from "axios";
import "./BiasAudit.css";

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
        "http://127.0.0.1:8000/api/ai_engine/bias_report/",
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
    <div className="bias-audit">
      <h3>Bias Detection</h3>
      <button
        className="bias-button"
        onClick={handleBiasCheck}
        disabled={loading}
      >
        {loading ? "Checking for Bias..." : "Run Bias Audit"}
      </button>

      {error && <p className="feedback-message error">{error}</p>}
      {biasResult && (
        <div
          className={`bias-result ${
            biasResult.bias_detected ? "biased" : "fair"
          }`}
        >
          <p>
            <strong>Status:</strong>{" "}
            {biasResult.bias_detected ? "Bias Detected" : "No Bias Detected"}
          </p>
          <p>
            <strong>Details:</strong> {biasResult.details}
          </p>
        </div>
      )}
    </div>
  );
};

export default BiasAudit;
