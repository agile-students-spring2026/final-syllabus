import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bearerHeaders } from "../utils/apiAuth";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ResourcePage = () => {
  const { user, token } = useAuth();
  const homePath = user?.role === 'campus-rep' || user?.role === 'campus_rep' ? '/camp-rep-dashboard' : '/home';
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    setData(null);
    fetch(`${API_BASE}/courses/${courseId}/resources`, { headers: bearerHeaders(token) })
      .then((res) => {
        if (res.status === 404) {
          setData(null);
          return null;
        }
        if (res.status === 403) {
          throw new Error("Add your school in your profile to view resources.");
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
  }, [courseId, token]);

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
        <Link to={homePath} className="resourceBack">Go home</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="resourcePage">
        <div className="resourceHeader">
          <h2>Course not found</h2>
          <Link to={homePath} className="resourceBack">
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
          <p className="resourceSub">no resources</p>
        ) : (
          resources.map((item) => (
            <div
              key={item.id}
              className="resourceCard"
              role="button"
              tabIndex={0}
            >
              <div className="resourceMeta">
                <span className="pill">{item.type}</span>
                <span className="pill pillGhost">{item.format}</span>
                <span className="pill when">{item.added}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="resourceHint">
                File: {item.title} — link stored as filename on the server.
              </p>
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
