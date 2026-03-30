import { Link } from "react-router-dom";
import "./SubmissionConfirmPage.css";

const SubmissionConfirmPage = () => {
  return (
    <div className="confirmPage">
      <header className="confirmHeader">
        <Link to="/home" className="logoStub">LOGO</Link>
        <Link to="/profile" className="profileStub" aria-label="profile" />
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
