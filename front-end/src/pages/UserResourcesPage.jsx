import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { userResources } from "../data/sampleDatabase";
import "./UserResourcesPage.css";

const categories = [
  "Notes",
  "Flashcards",
  "Videos",
  "Practice Questions",
];

const UserResourcesPage = () => {
  const grouped = categories.map((cat) => ({
    name: cat,
    items: userResources.filter((item) => item.category === cat),
  }));

  return (
    <div className="userResPage">
      <header className="userResHeader">
        <div className="logoStub">LOGO</div>
        <div className="headerRight">
          <button className="iconBtn" aria-label="spell check">AB</button>
          <button className="iconBtn" aria-label="add resource">+</button>
          <div className="profileStub" aria-hidden="true" />
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

      <div className="navBar">
        <Navbar />
      </div>

      <div className="homeLink">
        <Link to="/home">Back home</Link>
      </div>
    </div>
  );
};

export default UserResourcesPage;
