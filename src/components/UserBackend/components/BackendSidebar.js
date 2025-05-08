import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import './BackendSidebar.css';

const BackendSidebar = ({ selectedTab, onSelectTab }) => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className={selectedTab === 'profile' ? 'selected' : ''} onClick={() => onSelectTab('profile')}>
          <FontAwesomeIcon icon={faUser} />
          <span className="sidebar-text">User Profile & Filters</span>
        </li>
        <li className={`${selectedTab === 'jobAlert' ? 'selected' : ''}`} onClick={() => onSelectTab('jobAlert')}>
          <FontAwesomeIcon icon={faBell} />
          <span className="sidebar-text">Job Alert Settings</span>
        </li>
        <li className={`${selectedTab === 'account' ? 'selected' : ''}`} onClick={() => onSelectTab('account')}>
          <FontAwesomeIcon icon={faCreditCard} />
          <span className="sidebar-text">Account Management</span>
        </li>
      </ul>
    </div>
  );
};

export default BackendSidebar;
