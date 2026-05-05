import logo from '../assets/syllabus_plus_logo.svg';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CampusRepDetailsScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="Syllabus+" height="40" />
          <p>Tell us about yourself</p>
        </div>

        <div className="auth-form">
          <div className="input-group">
            <label>School</label>
            <input type="text" placeholder="New York University" />
          </div>

          <div className="input-group">
            <label>Major</label>
            <input type="text" placeholder="Computer Science" />
          </div>

          <button className="primary-btn" onClick={() => navigate('/camp-rep-dashboard')}>
            Next
          </button>

          <button className="back-link" onClick={() => navigate('/role-selection')}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampusRepDetailsScreen;
