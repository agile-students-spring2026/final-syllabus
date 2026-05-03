import { Link } from "react-router-dom";
const SubmissionConfirmPage = () => {
  return (
    <div className="confirmPage">
      <header className="confirmHeader">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0d18">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>
      </header>

      <main className="confirmMain">
        <div className="confirmBox">
          <p className="confirmLine1">Resources / Course added</p>
          <p className="confirmLine2">Awaiting Verification</p>
        </div>

        <Link to="/resources" className="confirmBack">
          Go back
        </Link>
      </main>
    </div>
  );
};

export default SubmissionConfirmPage;
