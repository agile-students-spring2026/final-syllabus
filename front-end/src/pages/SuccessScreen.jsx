import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-logo">Syllabus+</div>
      <div className="success-body">
        <h2 className="success-title">Thank you for Signing in</h2>
        <button className="success-done-btn" onClick={() => navigate('/home')}>Done</button>
      </div>
    </div>
  );
};

export default SuccessScreen;
