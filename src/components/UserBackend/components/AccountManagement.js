import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './AccountManagement.css';
import { validateEmail } from '../../../utils/validators';
import { callApi } from '../../../utils/apiHandler';
import { useUserSettings } from '../../../UserSettingsContext';
import Loading from '../../Loading';
import ResultAlert from '../../Modal/ResultAlert';
import ConfirmModal from '../../Modal/ConfirmModal';
import { CircularProgress } from '@mui/material';

const AccountManagement = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const { userSettings } = useUserSettings();
  const [emailUpdateStatus, setEmailUpdateStatus] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailUpdateLoading, setEmailUpldateLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const canEditEmail = userSettings?.social_login === 'auth0';

  const handleEmailUpdateConfirm = async () => {
    try {
      setEmailUpldateLoading(true);
      setShowConfirmModal(false);
      await callApi.post(`/user/${userSettings.user_id}/email`, { email: newEmail }, null, true);

      setAlertMessage('Verification email sent. Please Login with new email');
      setShowSuccessAlert(true);
    } catch (error) {
      setEmailUpdateStatus(error.data.message);
    } finally {
      setEmailUpldateLoading(false);
    }
  };

  const handleEmailUpdate = () => {
    const { isValid, error } = validateEmail(newEmail);
    if (!isValid) {
      setEmailUpdateStatus(error);
      return;
    }
    setShowConfirmModal(true);
    setEmailUpdateStatus('');
  };

  const handleAlertClose = () => {
    setShowSuccessAlert(false);
    logout({ returnTo: window.location.origin });
  };

  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
  };

  const deleteAccount = async () => {
    const userInput = prompt('Please type "DELETE ACCOUNT" to confirm.');

    if (userInput !== 'DELETE ACCOUNT') {
      alert('Account deletion cancelled. To delete your account, you must type "DELETE ACCOUNT".');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      await callApi.delete(`/user/${userSettings.user_id}`, null, true);
      alert('Account deleted successfully.');
      logout({ returnTo: window.location.origin });
    } catch (error) {
      console.error('Error during account deletion:', error);
      alert('An error occurred during account deletion. Please try again.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your account settings.</div>;
  }

  return (
    <div className="account-management container-padding">
      <ResultAlert open={showSuccessAlert} onClose={handleAlertClose} description={alertMessage} title="Success" />
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleConfirmModalClose}
        onConfirm={handleEmailUpdateConfirm}
        title="Update Email"
        message={`Are you sure you want to update your email?`}
        data={newEmail}
      />
      <div className="header">
        <h2 className="main-heading">Account Management</h2>
      </div>
      <div className="setting-box">
        <h3>Primary Email</h3>
        {isEditingEmail && canEditEmail ? (
          <div className="email-edit-section">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              disabled={emailUpdateLoading}
            />
            <div className="verification-status">
              {emailUpdateStatus ? (
                <div className="status-wrapper unverified">
                  <span className="status-icon">!</span>
                  <span className="status-text">{emailUpdateStatus}</span>
                </div>
              ) : null}
            </div>
            <div className="email-edit-buttons">
              <button onClick={handleEmailUpdate} className="save-button" disabled={emailUpdateLoading}>
                {emailUpdateLoading ? (
                  <CircularProgress
                    size={15}
                    sx={{
                      color: 'inherit',
                      marginRight: '8px',
                    }}
                  />
                ) : (
                  'Save'
                )}
              </button>
              <button
                onClick={() => {
                  setIsEditingEmail(false);
                  setNewEmail('');
                  setEmailUpdateStatus('');
                }}
                className="cancel-button"
                disabled={emailUpdateLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="email-display-section">
            <p>{user.email}</p>
            <div className="verification-status">
              {user.email_verified ? (
                <div className="status-wrapper verified">
                  <span className="status-icon">✓</span>
                  <span className="status-text">Verified</span>
                </div>
              ) : (
                <div className="status-wrapper unverified">
                  <span className="status-icon">!</span>
                  <span className="status-text">Not Verified</span>
                </div>
              )}
            </div>
            {canEditEmail && (
              <button
                onClick={() => {
                  setIsEditingEmail(true);
                  setNewEmail(user.email);
                }}
                className="save-button"
                disabled={emailUpdateLoading}
              >
                Edit Email
              </button>
            )}
          </div>
        )}
      </div>
      <div className="setting-box">
        <button onClick={deleteAccount} className="delete-button">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountManagement;
