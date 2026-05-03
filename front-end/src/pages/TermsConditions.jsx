import { useNavigate } from "react-router-dom";
const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="profilePage">
      <header className="profilePageHeader">
        <button className="profileBackBtn" onClick={() => navigate("/profile")}>←</button>
        <span style={{ fontWeight: 700, fontSize: "1rem" }}>Terms &amp; Conditions</span>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20, color: "#d1d5db", fontSize: "0.9rem", lineHeight: 1.7 }}>
        <section>
          <h2 style={{ color: "#f5f5f5", fontSize: "1rem", margin: "0 0 8px" }}>1. Acceptance of Terms</h2>
          <p style={{ margin: 0 }}>By using Syllabus+, you agree to these terms. If you do not agree, please do not use the app.</p>
        </section>

        <section>
          <h2 style={{ color: "#f5f5f5", fontSize: "1rem", margin: "0 0 8px" }}>2. Use of the Platform</h2>
          <p style={{ margin: 0 }}>Syllabus+ is an academic resource-sharing platform. You agree to use it only for lawful purposes and to share content you have the right to distribute.</p>
        </section>

        <section>
          <h2 style={{ color: "#f5f5f5", fontSize: "1rem", margin: "0 0 8px" }}>3. User Content</h2>
          <p style={{ margin: 0 }}>You retain ownership of content you upload. By uploading, you grant Syllabus+ a non-exclusive licence to display that content to other users of the platform.</p>
        </section>

        <section>
          <h2 style={{ color: "#f5f5f5", fontSize: "1rem", margin: "0 0 8px" }}>4. Account Responsibility</h2>
          <p style={{ margin: 0 }}>You are responsible for keeping your account credentials secure. Notify us immediately if you suspect unauthorised access.</p>
        </section>

        <section>
          <h2 style={{ color: "#f5f5f5", fontSize: "1rem", margin: "0 0 8px" }}>5. Privacy</h2>
          <p style={{ margin: 0 }}>We collect only the information necessary to provide the service (name, email, uploaded resources). We do not sell your data to third parties.</p>
        </section>

        <section>
          <h2 style={{ color: "#f5f5f5", fontSize: "1rem", margin: "0 0 8px" }}>6. Changes to Terms</h2>
          <p style={{ margin: 0 }}>We may update these terms from time to time. Continued use of Syllabus+ after changes are posted constitutes acceptance of the new terms.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
