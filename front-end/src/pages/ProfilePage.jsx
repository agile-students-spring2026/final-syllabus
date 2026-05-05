import logo from '../assets/syllabus_plus_logo.svg';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="profilePage">
      <header className="profilePageHeader">
        <button className="profileBackBtn" onClick={() => navigate(-1)}>←</button>
        <Link to="/home" className="logoStub"><img src={logo} alt="Syllabus+" height="32" /></Link>
      </header>

      <div className="profileIdentity">
        <div className="profileAvatar">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <div>
          <p className="profileName">{user?.fullName || user?.name || "User"}</p>
          <p className="profileEmail">{user?.email || ""}</p>
        </div>
      </div>

      <div className="profileDivider" />

      <nav className="profileMenu">
        <button className="profileMenuItem">Profile Settings</button>
        <div className="profileDivider" />
        <button className="profileMenuItem">Security &amp; Privacy</button>
        <div className="profileDivider" />
        <button className="profileMenuItem">Terms &amp; Conditions</button>
        <div className="profileDivider" />
        <button className="profileMenuItem profileDelete">Delete Account</button>
      </nav>

      <div className="profileLogoutWrap">
        <Link to="/login" className="profileLogout" onClick={logout}>Log out</Link>
      </div>
    </div>
  );
};

export default ProfilePage;
