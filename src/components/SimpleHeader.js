import React from 'react';
import { Link } from 'react-router-dom';
import './SimpleHeader.css';

const SimpleHeader = () => {
  return (
    <header className="simple-header">
      <div className="simple-header-container">
        <div className="logo-container">
          <Link to="/" style={{ display: 'inline-block' }}>
            <img src="/duck_white.png" alt="UNTalent Logo" className="logo-image" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
