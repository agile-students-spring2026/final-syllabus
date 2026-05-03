import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { US_UNIVERSITIES } from '../utils/universities';

const StudentDetailsScreen = () => {
  const navigate = useNavigate();
  const { token, login } = useAuth();
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!school) {
      setError('Please select a university');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ school, major }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not update profile');
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      navigate('/success');
    } catch {
      setError('Could not connect to server');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>LOGO</h1>
          <p>Tell us about yourself</p>
        </div>

        <div className="auth-form">
          <div className="input-group">
            <label>University *</label>
            <select 
              value={school} 
              onChange={(e) => setSchool(e.target.value)}
              className="input-select"
            >
              <option value="">Select your university</option>
              {US_UNIVERSITIES.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Major</label>
            <input 
              type="text" 
              placeholder="Computer Science" 
              value={major}
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-btn" onClick={handleNext} disabled={loading}>
            {loading ? 'Saving...' : 'Next'}
          </button>

          <button className="back-link" onClick={() => navigate('/role-selection')}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsScreen;
