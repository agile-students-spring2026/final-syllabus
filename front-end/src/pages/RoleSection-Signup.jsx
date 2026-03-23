import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelectionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card role-selection-card">
        <div className="auth-header">
          <h1>LOGO</h1>
          <p>Are you a student or a campus rep</p>
        </div>

        <div className="role-selection-options">
          <button className="role-card" onClick={() => navigate('/student-details')}>
            STUDENT
          </button>
          <button className="role-card" onClick={() => navigate('/campus-rep-details')}>
            CAMPUS REP
          </button>
        </div>

        <button className="back-link" onClick={() => navigate('/signup')}>Back</button>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
