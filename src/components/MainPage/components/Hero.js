import React from 'react';
import './Hero.css';

function Hero({ updateSearchTerm, searchTerm, isMobile }) {
  // const handleInputChange = (event) => {
  //   updateSearchTerm(event.target.value);
  // };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Advance Your UN Career</h1>
        <p>Discover internal opportunities across the UN system</p>
      </div>
      {/* {!isMobile && (
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search for jobs..."
            className="search-bar"
          />
        </div>
      )} */}
    </div>
  );
}

export default Hero;