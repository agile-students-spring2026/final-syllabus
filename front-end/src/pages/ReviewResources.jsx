import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useVerification } from "../context/VerificationContext";
import "./ReviewResources.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ReviewResources = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { incrementResources } = useVerification();

  const [resourceData, setResourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTypes, setActiveTypes] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/admin/resources/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setResourceData(data);
        if (data.types && data.types.length > 0) {
          setActiveTypes([data.types[0]]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  const toggleType = (type) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleAccept = () => {
    fetch(`${API_BASE}/admin/resources/${courseId}/approve`, { method: "POST" }).catch(() => {});
    incrementResources();
    navigate("/camp-rep-dashboard");
  };

  const handleReject = () => {
    fetch(`${API_BASE}/admin/resources/${courseId}/reject`, { method: "POST" }).catch(() => {});
    navigate("/camp-rep-dashboard");
  };

  if (loading) return <div className="reviewResPage" />;

  if (!resourceData || resourceData.error) {
    return (
      <div className="reviewResPage">
        <p style={{ color: "#f5f5f5", padding: 24 }}>Resource not found.</p>
      </div>
    );
  }

  return (
    <div className="reviewResPage">
      <header className="reviewResHeader">
        <Link to="/camp-rep-dashboard" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile" />
      </header>

      <div className="reviewResBackBtn">
        <Link to={-1}>&#8592; Review</Link>
      </div>

      <main className="reviewResMain">
        <div className="reviewResCard">
          <div className="reviewResThumbnail" />
          <div className="reviewResCardFooter">
            <div>
              <p className="reviewResTitle">{resourceData.courseName}</p>
              <p className="reviewResTypes">{resourceData.resourceTypes}</p>
            </div>
            <span className="reviewResBadge">Pending</span>
          </div>
        </div>

        <div className="reviewResPreview" aria-label="Content preview" />

        <div className="reviewResFilterRow">
          <span className="reviewResFilterLabel">Resource type</span>
          <div className="reviewResChips">
            {resourceData.types.map((type) => (
              <button
                key={type}
                className={`reviewResChip${activeTypes.includes(type) ? " reviewResChip--active" : ""}`}
                onClick={() => toggleType(type)}
              >
                {type}
              </button>
            ))}
            <button className="reviewResChipAdd" aria-label="Add resource type">+</button>
          </div>
        </div>

        <div className="reviewResActions">
          <button className="reviewResBtn reviewResBtn--reject" onClick={handleReject}>Reject</button>
          <button className="reviewResBtn reviewResBtn--accept" onClick={handleAccept}>Accept</button>
        </div>
      </main>
    </div>
  );
};

export default ReviewResources;
