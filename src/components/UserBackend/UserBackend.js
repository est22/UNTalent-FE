import React, { useState, useEffect } from 'react';
import BackendSidebar from './components/BackendSidebar';
import UserProfileAndFilters from './components/UserProfileAndFilters';
import JobAlertSettings from './components/JobAlertSettings';
import AccountManagement from './components/AccountManagement';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import './UserBackend.css';

const UserBackend = () => {
  const [selectedTab, setSelectedTab] = useState('profile'); // Default to 'profile'
  const { user } = useAuth0();
  const location = useLocation();

  useEffect(() => {
    console.log('UserBackend is being rendered');
  }, []);

  useEffect(() => {
    if (location.state?.selectedTab) {
      setSelectedTab(location.state.selectedTab);
    }
  }, [location]);

  const renderMainContent = () => {
    if (selectedTab === 'profile') return <UserProfileAndFilters />
    if (selectedTab === 'jobAlert') return <JobAlertSettings />;
    if (selectedTab === 'account') return <AccountManagement user={user} />;
  };

  return (
    <>
    <div className="user-backend-hero-background" />
    <div className="user-backend-container">
      <BackendSidebar selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div className="backend-main-content">
        <div className="main-content">
          { renderMainContent() }
        </div>
      </div>
    </div>
    </>
  );
};

export default UserBackend;
