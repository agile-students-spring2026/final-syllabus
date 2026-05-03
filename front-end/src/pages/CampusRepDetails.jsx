import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { US_UNIVERSITIES } from "../utils/universities";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const CampusRepDetailsScreen = () => {
  const navigate = useNavigate();
  const { token, login } = useAuth();
  const [school, setSchool] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!school) {
      setError("Please select a university");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ school }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not update profile");
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      navigate("/camp-rep-dashboard");
    } catch {
      setError("Could not connect to server");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>LOGO</h1>
          <p>Tell us about yourself</p>
        </div>

        <div className="auth-form">
          <div className="input-group">
            <label>University *</label>
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="input-select"
            >
              <option value="">Select your university</option>
              {US_UNIVERSITIES.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-btn" onClick={handleNext} disabled={loading}>
            {loading ? "Saving..." : "Next"}
          </button>

          <button className="back-link" onClick={() => navigate("/role-selection")}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampusRepDetailsScreen;
