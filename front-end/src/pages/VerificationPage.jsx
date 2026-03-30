import { Link } from "react-router-dom";
import "./VerificationPage.css";

const mockSubmissions = [
  { id: 1, title: "Course Title (CS101)", types: "Notes, Flashcards", status: "Pending" },
  { id: 2, title: "Course Title (CS101)", types: "Notes, Flashcards", status: "Accepted" },
  { id: 3, title: "Course Title (CS101)", types: "Notes, Flashcards", status: "Rejected" },
];

const VerificationPage = () => {
  return (
    <div className="verifyPage">
      <header className="verifyHeader">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile" />
      </header>

      <div className="verifyBackBtn">
        <Link to="/resources">← Back</Link>
      </div>


      <main className="verifyMain">
        <h1 className="verifyTitle">Verification</h1>
        <p className="verifySchool">School: New York University</p>

        <div className="verifyFilters">
          <select className="verifySelect">
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
          <select className="verifySelect">
            <option>Level</option>
            <option>Undergraduate</option>
            <option>Graduate</option>
          </select>
          <select className="verifySelect">
            <option>Category</option>
            <option>Notes</option>
            <option>Flashcards</option>
            <option>Videos</option>
          </select>
        </div>

        <div className="verifyList">
          {mockSubmissions.map((item) => (
            <div className="verifyCard" key={item.id}>
              <div className="verifyCardImage" />
              <div className="verifyCardFooter">
                <div>
                  <p className="verifyCardTitle">{item.title}</p>
                  <p className="verifyCardTypes">{item.types}</p>
                </div>
                <span className={`verifyBadge badge-${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default VerificationPage;
