import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const RoleSelectionScreen = () => {
  const navigate = useNavigate();
  const { token, login } = useAuth();
  const [error, setError] = useState("");

  const handleRoleSelect = async (role, path) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not update role");
        return;
      }

      login(data.user, data.token);
      navigate(path);
    } catch {
      setError("Could not connect to server");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card role-selection-card">
        <div className="auth-header">
          <h1>LOGO</h1>
          <p>Are you a student or a campus rep</p>
        </div>

        <div className="role-selection-options">
          <button className="role-card" onClick={() => handleRoleSelect("student", "/student-details")}>
            STUDENT
          </button>
          <button className="role-card" onClick={() => handleRoleSelect("campus-rep", "/campus-rep-details")}>
            CAMPUS REP
          </button>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="back-link" onClick={() => navigate("/signup")}>Back</button>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
