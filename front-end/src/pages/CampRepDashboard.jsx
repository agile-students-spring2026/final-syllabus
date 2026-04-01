import { useState } from "react";
import { courses, userResources } from "../data/sampleDatabase";

const FILTERS = ["Recent", "Pending", "Category"];

const pendingCourses = courses
  .filter((c) => !c.verified)
  .map((c) => ({ id: `course-${c.id}`, topic: c.topic, name: c.name, category: c.category, kind: "Course" }));

const pendingResources = userResources
  .filter((r) => !r.verified)
  .map((r) => ({ id: r.id, topic: r.topic, name: r.title, category: r.category, kind: "Resource" }));

const pendingItems = [...pendingCourses, ...pendingResources];

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

        <div className="campRepReviewSection">
          <h2 className="campRepReviewTitle">Pending Review</h2>
          <div className="campRepReviewList">
            {pendingItems.map((item) => (
              <div key={item.id} className="campRepReviewCard">
                <div className="campRepReviewCardTop">
                  <span className="campRepReviewTopic">{item.topic}</span>
                  <span className="campRepPendingBadge">Pending</span>
                </div>
                <p className="campRepReviewName">{item.name}</p>
                <span className="campRepReviewCategory">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampRepDashboard;
