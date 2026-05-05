import logo from '../assets/syllabus_plus_logo.svg';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE}/auth/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete account");
      logout();
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="profilePage">
      <header className="profilePageHeader">
        <button className="profileBackBtn" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/home")}>←</button>
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
        <button className="profileMenuItem" onClick={() => navigate("/profile/settings")}>Profile Settings</button>
        <div className="profileDivider" />
        <button className="profileMenuItem" onClick={() => navigate("/profile/security")}>Security &amp; Privacy</button>
        <div className="profileDivider" />
        <button className="profileMenuItem" onClick={() => navigate("/profile/terms")}>Terms &amp; Conditions</button>
        <div className="profileDivider" />
        <button className="profileMenuItem profileDelete" onClick={handleDeleteAccount}>Delete Account</button>
      </nav>

      <div className="profileLogoutWrap">
        <Link to="/login" className="profileLogout" onClick={logout}>Log out</Link>
      </div>
    </div>
  );
};

export default ProfilePage;
