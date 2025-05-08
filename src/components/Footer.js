import React from 'react';
import './Footer.css'; // Make sure to create a corresponding CSS file for styling
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
      <p>&copy; {new Date().getFullYear()} UNTalent. All Rights Reserved.</p>
      <nav className="footer-nav">
        <ul>
          <li><Link to="/about.html">About Us</Link></li>
          <li><Link to="/terms-of-service.html">Terms of Service</Link></li>
          <li><Link to="/privacy.html">Privacy Policy</Link></li>
          <li><a href="mailto:admin@UNTalent.io">Contact</a></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
