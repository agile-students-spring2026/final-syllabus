import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./ResourcePage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ResourcePage = () => {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    setData(null);
    fetch(`${API_BASE}/courses/${courseId}/resources`)
      .then((res) => {
        if (res.status === 404) {
          setData(null);
          return null;
        }
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
        setLoading(false);
      })
      .catch(() => {
        setErr("Could not load resources");
        setLoading(false);
      });
  }, [courseId]);

  if (loading) {
    return (
      <div className="resourcePage">
        <p className="status-message">Loading…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="resourcePage">
        <p>{err}</p>
        <Link to="/home" className="resourceBack">Go home</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="resourcePage">
        <div className="resourceHeader">
          <h2>Course not found</h2>
          <Link to="/home" className="resourceBack">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const { courseName, resources: grouped = {} } = data;
  const resources = Object.values(grouped).flat().map((r) => ({
    id: r.id,
    title: r.title,
    type: r.category,
    format: "File",
    added: r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : "",
    fileUrl: r.fileUrl || null,
  }));

  return (
    <div className="resourcePage">
      <div className="resourceHeader">
        <p className="resourceEyebrow">Resources</p>
        <h2>{courseName}</h2>
        <p className="resourceSub">
          Shared drops for this class. Grab what you need or add your own later.
        </p>
      </div>

      <div className="resourceList">
        {resources.length === 0 ? (
          <div className="resourceEmpty">
            <p>No resources yet. Be the first to share something useful.</p>
          </div>
        ) : (
          resources.map((item) => (
            <div key={item.id} className="resourceCard">
              <div className="resourceMeta">
                <span className="pill">{item.type}</span>
                <span className="pill pillGhost">{item.format}</span>
                <span className="pill when">{item.added}</span>
              </div>
              <h3>{item.title}</h3>
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resourceDownload"
                >
                  View / Download
                </a>
              ) : (
                <p className="resourceHint">File not available</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="resourceActions">
        <Link to={`/courses/${courseId}`} className="resourceBack">
          Back to course
        </Link>
      </div>

    </div>
  );
};

export default ResourcePage;
