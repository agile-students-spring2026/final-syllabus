import logo from '../assets/syllabus_plus_logo.svg';
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ReviewResources.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ReviewResources = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

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

  const visibleResources = activeTypes.length > 0
    ? (resourceData.resources || []).filter((r) => activeTypes.includes(r.type))
    : (resourceData.resources || []);

  return (
    <div className="reviewResPage">
      <header className="reviewResHeader">
        <Link to="/camp-rep-dashboard" className="logoStub"><img src={logo} alt="Syllabus+" height="32" /></Link>
        <Link to="/profile" className="profileStub" aria-label="profile" />
      </header>

      <div className="reviewResBackBtn">
        <Link to="/camp-rep-dashboard">&#8592; Review</Link>
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
          </div>
        </div>

        <div className="reviewResFileList">
          {visibleResources.length === 0 ? (
            <p className="reviewResEmpty">No resources for the selected type.</p>
          ) : (
            visibleResources.map((item) => (
              <div key={item.id} className="reviewResFileItem">
                <div className="reviewResFileInfo">
                  <span className="reviewResFileType">{item.type}</span>
                  <span className="reviewResFileTitle">{item.title}</span>
                  <span className="reviewResFileAdded">{item.added}</span>
                </div>
                {item.fileUrl ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reviewResFileLink"
                  >
                    View File
                  </a>
                ) : (
                  <span className="reviewResFileLink reviewResFileLink--missing">No file</span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="reviewResActions">
          <button className="reviewResBtn reviewResBtn--reject" onClick={handleReject}>Reject All</button>
          <button className="reviewResBtn reviewResBtn--accept" onClick={handleAccept}>Accept All</button>
        </div>
      </main>
    </div>
  );
};

export default ReviewResources;
