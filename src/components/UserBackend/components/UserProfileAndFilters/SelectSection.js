import React from 'react';
import SelectWithLoading from './SelectWithLoading';
import './UserProfile.css';

const SelectSection = ({ isLoading, title, description, ...selectProps }) => {
  return (
    <div className="backend-filter-with-description">
      <div className="backend-description">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="backend-filter-item">
        <SelectWithLoading isLoading={isLoading} {...selectProps} />
      </div>
    </div>
  );
};

export default SelectSection;
