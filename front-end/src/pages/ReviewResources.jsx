import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { courses } from "../data/sampleDatabase";
import { useVerification } from "../context/VerificationContext";
import "./ReviewResources.css";

const ReviewResources = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { incrementResources } = useVerification();
  const course = courses.find((c) => String(c.id) === courseId) ?? courses[0];

  const handleAccept = () => {
    incrementResources();
    navigate("/camp-rep-dashboard");
  };

  const allTypes = [...new Set(course.resources.map((r) => r.type))];
  const resourceTypes = allTypes.join(", ");

  const [activeTypes, setActiveTypes] = useState([allTypes[0]]);

  const toggleType = (type) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="reviewResPage">
      <header className="reviewResHeader">
        <Link to="/camp-rep-dashboard" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      </header>

      <div className="reviewResBackBtn">
        <Link to={-1}>&#8592; Review</Link>
      </div>

      <main className="reviewResMain">
        <div className="reviewResCard">
          <div className="reviewResThumbnail" />
          <div className="reviewResCardFooter">
            <div>
              <p className="reviewResTitle">{course.name}</p>
              <p className="reviewResTypes">{resourceTypes}</p>
            </div>
            <span className="reviewResBadge">Pending</span>
          </div>
        </div>

        <div className="reviewResPreview" aria-label="Content preview" />

        <div className="reviewResFilterRow">
          <span className="reviewResFilterLabel">Resource type</span>
          <div className="reviewResChips">
            {allTypes.map((type) => (
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
          <button className="reviewResBtn reviewResBtn--reject">Reject</button>
          <button className="reviewResBtn reviewResBtn--accept" onClick={handleAccept}>Accept</button>
        </div>
      </main>
    </div>
  );
};

export default ReviewResources;
