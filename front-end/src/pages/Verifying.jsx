import logo from '../assets/syllabus_plus_logo.svg';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-screen centered-screen">
      <div className="auth-logo-placeholder mt-12 mb-auto"><img src={logo} alt="Syllabus+" height="40" /></div>

      <div className="success-content mb-auto flex flex-col items-center">
        <h2 className="success-title mb-6">Verifying your account</h2>
        <p className="auth-footer-text">We are reviewing your transcript. You will be notified once your campus rep account is verified.</p>
        <button className="primary-btn mt-8" onClick={() => navigate('/camp-rep-dashboard')}>Done</button>
      </div>
    </div>
  );
};

export default VerifyingScreen;
