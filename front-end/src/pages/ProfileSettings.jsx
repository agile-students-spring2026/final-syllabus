import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, token, login } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || user?.name || "");
  const [email] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      login(data.user, token);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profilePage">
      <header className="profilePageHeader">
        <button className="profileBackBtn" onClick={() => navigate("/profile")}>←</button>
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>Profile Settings</span>
        <div style={{ width: 32 }} />
      </header>

      <form onSubmit={handleSave} style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "#8a9ab5" }}>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #1e2d45", background: "#111827", color: "#f5f5f5", fontSize: "1rem", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", color: "#8a9ab5" }}>Email</label>
          <input
            type="email"
            value={email}
            disabled
            style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #1e2d45", background: "#0c1020", color: "#4a5568", fontSize: "1rem", boxSizing: "border-box", cursor: "not-allowed" }}
          />
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#4a5568" }}>Email cannot be changed</p>
        </div>

        {message && <p style={{ color: "#34d399", margin: 0 }}>{message}</p>}
        {error && <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{ marginTop: 8, padding: "13px", borderRadius: 999, background: saving ? "#1e2d45" : "#d9dce3", color: "#0a0d18", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
