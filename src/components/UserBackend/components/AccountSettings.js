import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './AccountSettings.css';

const AccountSettings = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [jobAlertEmail, setJobAlertEmail] = useState('');
  const [jobAlertEmailVerificationStatus, setJobAlertEmailVerificationStatus] = useState(false);
  const [emailError, setEmailError] = useState('');

  const baseURL = 'http://localhost:4000'; // Define the base URL for your API


  useEffect(() => {
    if (user) {
      setJobAlertEmail(user.email); // Initialize with the primary email
      fetchUserProfile();
    }
  }, [user, getAccessTokenSilently]);

  const fetchUserProfile = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios.get(`${baseURL}/api/getUserProfile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { user_metadata } = response.data;
      if (user_metadata?.job_alert_email) {
        setJobAlertEmail(user_metadata.job_alert_email);
        setJobAlertEmailVerificationStatus(user_metadata?.job_alert_email_verified || false);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const validateEmail = (email) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i.test(email);
  };

  const updateJobAlertEmail = async () => {
    if (!validateEmail(jobAlertEmail)) {
        setEmailError('Please enter a valid email address for job alerts.');
        return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      await axios.post(`${baseURL}/api/updateJobAlertEmail`, {
          userId: user.sub,
          jobAlertEmail
      }, {
          headers: { Authorization: `Bearer ${accessToken}` },
      });
        alert('Job alert email updated. Please verify the new email address.');
        setJobAlertEmailVerificationStatus(false); // Assume unverified until confirmed
    } catch (error) {
        console.error('Failed to update job alert email:', error.response ? error.response.data : error);
        setEmailError('Failed to update job alert email. Please try again.');
    }
};


const requestPasswordChange = async () => {
  try {
    const accessToken = await getAccessTokenSilently();
    await axios.post(`${baseURL}/api/requestPasswordChange`, {
        email: user.email
    }, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
      alert('Password change request submitted. Please check your email.');
    } catch (error) {
      console.error('Error requesting password change:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your account settings.</div>;
  }

  return (
    <div className="account-settings">
      <div className="header">
        <h2>Account Settings</h2>
      </div>
      <div className="setting-box">
        <h3>Primary Email</h3>
        <p>{user.email}</p>
      </div>
      <div className="setting-box">
        <h3>Email for Job Alerts</h3>
        <input 
          type="email" 
          placeholder="Enter email for job alerts" 
          value={jobAlertEmail} 
          onChange={(e) => setJobAlertEmail(e.target.value)} 
        />
        {emailError && <p className="error-message">{emailError}</p>}
        <button onClick={updateJobAlertEmail} className="save-button">Update Email for Job Alerts</button>
        <p>Status: {jobAlertEmailVerificationStatus ? "Verified" : "Unverified"}</p>
      </div>
      <div className="setting-box">
        <button onClick={requestPasswordChange} className="save-button">Request Password Change</button>
      </div>
    </div>
  );
};

export default AccountSettings;
