import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="profilePage">
      <header className="profilePageHeader">
        <button className="profileBackBtn" onClick={() => navigate(-1)}>←</button>
        <Link to="/home" className="logoStub">LOGO</Link>
      </header>

      <div className="profileIdentity">
        <div className="profileAvatar">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
        <div>
          <p className="profileName">John Doe</p>
          <p className="profileEmail">johndoe@gmail.com</p>
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
        <Link to="/login" className="profileLogout">Log out</Link>
      </div>
    </div>
  );
};

export default ProfilePage;
