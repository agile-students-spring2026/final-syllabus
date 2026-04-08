import { useState } from "react";
import { Link } from "react-router-dom";
import { courses, userResources } from "../data/sampleDatabase";
import { useVerification } from "../context/VerificationContext";
import "./CampRepDashboard.css";

const FILTERS = ["Recent", "Pending+", "Category+"];

const pendingItems = [
  ...courses.slice(0, 2).map((c) => ({
    id: `course-${c.id}`,
    courseId: c.id,
    kind: "Course",
    name: c.name,
    category: c.category,
    to: `/review-course/${c.id}`,
  })),
  ...userResources.slice(0, 2).map((r) => ({
    id: r.id,
    courseId: r.courseId,
    kind: "Resource",
    name: r.title,
    category: r.category,
    to: `/review-resources/${r.courseId}`,
  })),
];

const CampRepDashboard = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const { verifiedCourses, verifiedResources } = useVerification();

  return (
    <div className="campRepDash">
      <header className="campRepDashHeader">
        <Link to="/camp-rep-dashboard" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      </header>

      <main className="campRepDashMain">
        <p className="campRepDashEyebrow">CMP1001</p>
        <h1 className="campRepDashTitle">Dash board</h1>

        <div className="campRepFilters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`campRepFilterBtn${activeFilter === f ? " campRepFilterBtn--active" : ""}`}
              onClick={() => setActiveFilter(activeFilter === f ? null : f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="campRepStatsCard">
          <div className="campRepStatRow">
            <span className="campRepStatLabel">Verified Course</span>
            <span className="campRepStatValue">{verifiedCourses}</span>
          </div>
          <div className="campRepStatDivider" />
          <div className="campRepStatRow">
            <span className="campRepStatLabel">Verified Resources</span>
            <span className="campRepStatValue">{verifiedResources}</span>
          </div>
        </div>

        <div className="campRepReviewSection">
          <h2 className="campRepReviewTitle">Pending Review</h2>
          <div className="campRepReviewList">
            {pendingItems.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="campRepReviewCard"
              >
                <div className="campRepReviewCardTop">
                  <span className="campRepReviewKind">{item.kind}</span>
                  <span className="campRepPendingBadge">Pending</span>
                </div>
                <p className="campRepReviewName">{item.name}</p>
                <span className="campRepReviewCategory">{item.category}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampRepDashboard;
