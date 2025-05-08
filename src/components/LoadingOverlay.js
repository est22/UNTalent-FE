import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './LoadingOverlay.css';

const funnyTexts = [
  'Matching you with your dream job...',
  'Analyzing your resume with AI magic...',
  'Searching the globe for opportunities...',
  'Preparing your job application jetpack...',
  'Asking the job fairy for a little luck...'
];

const LoadingOverlay = ({ isLoading, progress }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    let textInterval;
    if (isLoading) {
      setCurrentTextIndex(0);
      textInterval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % funnyTexts.length);
      }, 3000);

      return () => {
        clearInterval(textInterval);
      };
    }
  }, [isLoading]); // Include progress in dependency array to properly handle updates

  return isLoading ? (
    <div className="overlay">
      <div className="overlay-text">
        {funnyTexts[currentTextIndex]}
      </div>
      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  ) : null;
};

LoadingOverlay.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired
};

export default LoadingOverlay;
