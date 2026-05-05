import logo from '../assets/syllabus_plus_logo.svg';

function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="Syllabus+" height="40" />
          {title && title !== "Syllabus+" && <h1>{title}</h1>}
          <p>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthCard;