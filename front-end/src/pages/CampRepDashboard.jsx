import { useState } from "react";
import { courses, userResources } from "../data/sampleDatabase";

const FILTERS = ["Recent", "Pending+", "Category+"];

const CampRepDashboard = () => {
  const [activeFilter, setActiveFilter] = useState(null);

  const verifiedCourses = courses.filter((c) => c.verified).length;
  const verifiedResources = userResources.filter((r) => r.verified).length;

  return (
    <div className="campRepDash">
      <header className="campRepDashHeader">
        <div className="logoStub">LOGO</div>
        <div className="profileStub" aria-label="profile" />
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
      </main>
    </div>
  );
};

export default CampRepDashboard;
