import { Link } from "react-router-dom";
import { userResources } from "../data/sampleDatabase";
import { useState } from "react";
import "./UserResourcesPage.css";

const categories = [
  "Notes",
  "Flashcards",
  "Videos",
  "Practice Questions",
];

const UserResourcesPage = () => {
  const [showFabMenu, setShowFabMenu] = useState(false);
  const grouped = categories.map((cat) => ({
    name: cat,
    items: userResources.filter((item) => item.category === cat),
  }));

  return (
    <div className="userResPage">
      <header className="userResHeader">
        <Link to="/home" className="logoStub">LOGO</Link>
        <div className="headerRight">
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

        {grouped.map((group) => (
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
