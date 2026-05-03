import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bearerHeaders } from "../utils/apiAuth";
import "./VerificationPage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const categoryLabel = {
  notes: "Notes",
  flashcards: "Flashcards",
  videos: "Videos",
  practice: "Practice Questions",
};

const VerificationPage = () => {
  const { token, user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your submissions");
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/resources/all`, {
      headers: bearerHeaders(token),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load submissions");
        return res.json();
      })
      .then((data) => {
        setResources(data.resources || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const filtered = resources.filter((r) => {
    const status = r.verified ? "accepted" : "pending";
    if (statusFilter && status !== statusFilter) return false;
    if (categoryFilter && r.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="verifyPage">
      <header className="verifyHeader">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      </header>

      <div className="verifyBackBtn">
        <Link to="/resources">← Back</Link>
      </div>

      <main className="verifyMain">
        <h1 className="verifyTitle">My Submissions</h1>
        {user?.school && <p className="verifySchool">School: {user.school}</p>}

        <div className="verifyFilters">
          <select
            className="verifySelect"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
          </select>
          <select
            className="verifySelect"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="notes">Notes</option>
            <option value="flashcards">Flashcards</option>
            <option value="videos">Videos</option>
            <option value="practice">Practice Questions</option>
          </select>
        </div>

        {loading && <p style={{ color: "#8a9ab5" }}>Loading…</p>}
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p style={{ color: "#8a9ab5", marginTop: 8 }}>
            {resources.length === 0
              ? "You haven't uploaded any resources yet."
              : "No submissions match the selected filters."}
          </p>
        )}

        <div className="verifyList">
          {filtered.map((item) => {
            const status = item.verified ? "accepted" : "pending";
            return (
              <div className="verifyCard" key={item.id}>
                <div className="verifyCardImage" />
                <div className="verifyCardFooter">
                  <div>
                    <p className="verifyCardTitle">{item.title}</p>
                    <p className="verifyCardTypes">
                      {categoryLabel[item.category] || item.category}
                      {item.courseLabel ? ` · ${item.courseLabel}` : ""}
                    </p>
                  </div>
                  <span className={`verifyBadge badge-${status}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default VerificationPage;
