import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './NavBar.css';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {AuthButtonSkeleton} from './AuthButtonSkeleton'
import { useUserSettings } from '../../UserSettingsContext';

const AuthMenu = ({
  isOpen, onClose, isAuthenticated, userSettings, onLogin, onSignUp, onLogout, isMobile }) => (
  <>
    <div className={`auth-menu ${isMobile ? 'mobile-auth-menu' : 'desktop-auth-menu'} ${isOpen ? 'open' : ''}`}>
      {isMobile && (
        <IconButton onClick={onClose} className="close-menu-button">
          <CloseIcon style={{ color: '#333', fill: '#333' }} />
        </IconButton>
      )}
      <ul className="auth-items">
        {isAuthenticated && userSettings ? (
          <>
            <li className="profile-info">
              <Link
                  to="/profile"
                  onClick={onClose}
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    cursor: 'pointer'
                  }}
                >
                  <button>Profile</button>
              </Link>
            </li>
            <li><button onClick={onLogout}>Logout</button></li>
          </>
        ) : (
          <>
            {/* Commented out login/signup for maintenance as per previous state */}
            {/* <li><button onClick={onLogin}>Login</button></li> */}
            {/* <li><button onClick={onSignUp}>Sign Up</button></li> */}
          </>
        )}
      </ul>
    </div>
    {isOpen && (
      <div className="menu-overlay" onClick={onClose} />
    )}
  </>
);

const Navbar = ({ onTempLogout }) => {
  const {
    isAuthenticated,
    user,
    handleLogin,
    handleSignUp,
    handleLogout: handleAuth0Logout,
    isLoading
  } = useAuth();
  // const WORDPRESS_URL = process.env.REACT_APP_WORDPRESS_URL; // Removed unused variable

  const [mobileAuthMenuOpen, setMobileAuthMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const { userSettings } = useUserSettings();

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 968;
      setIsMobile(newIsMobile)
      if (!newIsMobile) {
        setMobileAuthMenuOpen(false);
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollProgress(Math.min(100, Math.max(0, scrollPosition)));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getNavbarStyle = () => {
    const bgColor = scrollProgress > 10 ? 'rgba(0, 0, 0, 0.8)' : 'transparent';
    return {
      backgroundColor: bgColor,
      zIndex: 999,
      transition: 'background-color 0.3s ease',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 2rem',
    };
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderAuthButton = () => {
    if (isLoading || (isAuthenticated && !userSettings)) {
      return <AuthButtonSkeleton isMobile={isMobile} />;
    }

    if (isAuthenticated && userSettings) {
      return (
        <div className="auth-button">
          <IconButton onClick={() => setMobileAuthMenuOpen(true)} style={{ color: 'white' }}>
            {user.picture ? (
              <img src={user.picture} alt="Profile" className="user-avatar"/>
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
          </IconButton>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {/* Floating Logo Container - Acts as top bar on mobile */}
      <div className="floating-logo-container">
         <div
           className="floating-logo-wrapper"
           onMouseEnter={() => setIsLogoHovered(true)}
           onMouseLeave={() => setIsLogoHovered(false)}
         >
            <Link to="/" onClick={handleLogoClick}>
                <img
                    src={require('../../assets/UNDP-Logo-White-Large.png')}
                    alt="UNDP Floating Logo"
                    className="floating-logo"
                />
            </Link>
            {isLogoHovered && (
                <ArrowUpwardIcon className="scroll-top-arrow" />
            )}
         </div>
         {/* Render Auth button inside this container on mobile */}
         {isMobile && renderAuthButton()}
      </div>

      {/* Navbar Container - Only for Desktop links */}
      {!isMobile && (
          <header className={`header-container`} style={getNavbarStyle()}>
              <ul className="nav-links right">
                  {/* --- TEMP: Hide About/Blog links START --- */}
                  {/* <li><a href="/about.html" className="nav-button">About</a></li> */}
                  {/* <li><a href={WORDPRESS_URL} className="nav-button">Blog</a></li> */}
                  {/* --- TEMP: Hide About/Blog links END --- */}
                  <li>{renderAuthButton()}</li>
                  {/* Conditionally render Logout button if onTempLogout prop exists */}
                  {onTempLogout && (
                      <li>
                          <button onClick={onTempLogout} className="nav-button logout-button">
                              Logout
                          </button>
                      </li>
                  )}
              </ul>
          </header>
      )}

       {/* Auth Menu and Overlay */}
       <AuthMenu
           isOpen={mobileAuthMenuOpen}
           onClose={() => setMobileAuthMenuOpen(false)}
           isAuthenticated={isAuthenticated}
           user={user}
           onLogin={handleLogin}
           onSignUp={handleSignUp}
           onLogout={handleAuth0Logout}
           isMobile={isMobile}
           userSettings={userSettings}
       />
       {mobileAuthMenuOpen && (
         <div
           className="mobile-menu-overlay"
           onClick={() => setMobileAuthMenuOpen(false)}
         />
       )}
    </>
  );
};

export default Navbar;