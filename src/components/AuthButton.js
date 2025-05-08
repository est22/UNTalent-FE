import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthButton.css';

const AuthButton = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleManageAccountClick = () => {
    setShowPopup(false);
    navigate('/user-backend', { state: { selectedTab: 'account' } });
  };

  if (isAuthenticated && user) {
    return (
      <div className="auth-button" ref={popupRef}>
        <img
          src={user.picture}
          alt="Profile"
          className="user-avatar"
          onClick={() => setShowPopup(!showPopup)}
        />
        {showPopup && (
          <div className={`dropdown-content ${showPopup ? 'show' : ''}`}>
            <span className="close-button" onClick={() => setShowPopup(false)}>&#10005;</span>
            <img src={user.picture} alt="Profile" className="user-avatar-large" />
            <div className="welcome-text">Welcome, {user.name}</div>
            <button onClick={handleManageAccountClick} className="manage-account">Manage Account</button>
            <button onClick={() => logout({ returnTo: window.location.origin })} className="logout-button">Logout</button>
            <div className="footer-links">
              <Link to="/privacy">Privacy Statement</Link>
              <Link to="/terms">Terms of Use</Link>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <button type="button" className="login-button" onClick={() => loginWithRedirect()}>
        Login
      </button>
    );
  }
};

export default AuthButton;
