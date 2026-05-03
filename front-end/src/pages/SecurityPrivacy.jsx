import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const SecurityPrivacy = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/auth/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #1e2d45", background: "#111827", color: "#f5f5f5", fontSize: "1rem", boxSizing: "border-box" };

  return (
    <div className="profilePage">
      <header className="profilePageHeader">
        <button className="profileBackBtn" onClick={() => navigate("/profile")}>←</button>
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>Security &amp; Privacy</span>
        <div style={{ width: 32 }} />
      </header>

      <form onSubmit={handleSubmit} style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#8a9ab5" }}>Change your password below.</p>

        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "#8a9ab5" }}>Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "#8a9ab5" }}>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "#8a9ab5" }}>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />
        </div>

        {message && <p style={{ color: "#34d399", margin: 0 }}>{message}</p>}
        {error && <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{ marginTop: 8, padding: "13px", borderRadius: 999, background: saving ? "#1e2d45" : "#d9dce3", color: "#0a0d18", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default SecurityPrivacy;
