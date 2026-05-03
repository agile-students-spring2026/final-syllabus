import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import "./UserResourcesPage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const categories = [
  "Notes",
  "Flashcards",
  "Videos",
  "Practice Questions",
];

const apiToUi = {
  notes: "Notes",
  flashcards: "Flashcards",
  videos: "Videos",
  practice: "Practice Questions",
};

const UserResourcesPage = () => {
  const { user } = useAuth();
  const homePath = user?.role === "campus-rep" ? "/camp-rep-dashboard" : "/home";
  const isCampusRep = user?.role === "campus-rep";
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [userResources, setUserResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/resources/history`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load resources");
        return res.json();
      })
      .then((data) => {
        const list = (data.resources || []).map((r) => ({
          id: r.id,
          title: r.title,
          course: r.courseLabel || "—",
          category: apiToUi[r.category] || r.category,
        }));
        setUserResources(list);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setUserResources([]);
        setLoading(false);
      });
  }, []);

  const grouped = useMemo(
    () =>
      categories.map((cat) => ({
        name: cat,
        items: userResources.filter((item) => item.category === cat),
      })),
    [userResources]
  );

  return (
    <div className="userResPage">
      <header className="userResHeader">
        <Link to={homePath} className="logoStub">LOGO</Link>
        <div className="headerRight">
          {!isCampusRep && (
            <>
              <Link to="/verification" className="iconBtn" style={{ textDecoration: 'none' }}>AB</Link>
              <div className="fabWrap">
                <button
                  className="iconBtn"
                  aria-label="add resource"
                  onClick={() => setShowFabMenu((prev) => !prev)}
                >
                  +
                </button>
                {showFabMenu && (
                  <div className="fabMenu">
                    <Link to="/create-course" className="fabItem">
                      Create Course
                    </Link>
                    <Link to="/create-resource?from=direct" className="fabItem">
                      Create Resource
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
          <Link to="/profile" className="profileStub" aria-label="profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="userResMain">
        <div className="userResTitleRow">
          <h1>Resources</h1>
        </div>

        {loading && <p className="status-message">Loading…</p>}
        {error && <p className="status-message error">Error: {error}</p>}

        {!loading && !error && userResources.length === 0 && (
          <p className="status-message" style={{ margin: "1rem 0" }}>
            No resources in the database yet. Upload from Create Resource after choosing a course.
          </p>
        )}

        {!loading && !error &&
          userResources.length > 0 &&
          grouped.map((group) => (
            <section key={group.name} className="userResSection">
              <div className="sectionHead">
                <span className="sectionPill">{group.name}</span>
                <button className="viewAll" type="button">
                  View all
                </button>
              </div>

              <div className="sectionCard">
                <div className="fieldRow">
                  <label className="fieldLabel">Title :</label>
                  <div className="fieldBox">
                    {group.items[0]?.title || "(add a title)"}
                  </div>
                </div>
                <div className="fieldRow">
                  <label className="fieldLabel">Course:</label>
                  <div className="fieldBox">
                    {group.items[0]?.course || "(pick a course)"}
                  </div>
                </div>
              </div>
            </section>
          ))}
      </main>


    </div>
  );
};

export default UserResourcesPage;
