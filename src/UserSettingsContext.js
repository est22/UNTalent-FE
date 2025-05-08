import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { callApi } from './utils/apiHandler';
import { checkCookiesValue } from './utils/cookie';
import TermsOfServiceModal from './components/Modal/TermsOfServiceModal';
import EmailVerificationModal from './components/Modal/EmailVerificationModal';

export const UserSettingsContext = createContext();
export const UserSettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const { user, isAuthenticated, getAccessTokenSilently, getIdTokenClaims, isLoading, logout } = useAuth0();

  const getAuthOUserInfo = useCallback((user) => {
    return {
      email: user.email,
      name: user.name,
      picture: user.picture,
      email_verified: user.email_verified,
    };
  }, []);

  const checkAuth0Cookie = useCallback(() => {
    return checkCookiesValue('auth0');
  }, []);

  const handleTermsReject = useCallback(() => {
    setShowTerms(false);
    setUserSettings(null);
    logout({ returnTo: window.location.origin });
  }, [logout]);

  const handleTermsSubmit = async (agreements) => {
    try {
      const [accessToken, idToken] = await Promise.all([getAccessTokenSilently(), getIdTokenClaims()]);
      const response = await callApi.post(
        '/auth/signup',
        {
          id_token: idToken.__raw,
          access_token: accessToken,
          agreements,
        },
        false,
        true
      );

      const authOInfo = getAuthOUserInfo(user);
      setUserSettings({ ...response.data, ...authOInfo });
      setShowTerms(false);
      setShowEmailVerification(true);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const login = useCallback(async () => {
    let response;
    if (isAuthenticated) {
      try {
        const [accessToken, idToken] = await Promise.all([getAccessTokenSilently(), getIdTokenClaims()]);
        response = await callApi.post(
          '/auth/login',
          { id_token: idToken.__raw, access_token: accessToken },
          false,
          true
        );
        if (!response) {
          setShowTerms(true);
          return;
        }
        const authOInfo = getAuthOUserInfo(user);
        setUserSettings({ ...response.data, ...authOInfo });
      } catch (error) {
        console.error('Backend login error:', error);
      }
    }
  }, [isAuthenticated, getAccessTokenSilently, getIdTokenClaims, getAuthOUserInfo, user]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isLoading) return;

      const hasAuth0Cookie = checkAuth0Cookie();
      // Refresh the web but auth0 have been loged in
      if (hasAuth0Cookie && !isAuthenticated && !user) {
        try {
          await getAccessTokenSilently();
          const authOInfo = getAuthOUserInfo(user);
          setUserSettings(authOInfo);
        } catch (error) {
          console.error('Session recovery failed:', error);
        }
      }

      if (hasAuth0Cookie && isAuthenticated && user) {
        await login();
      } else if (!hasAuth0Cookie || !isAuthenticated) {
        setUserSettings(null);
      }
    };

    if (isAuthenticated && !isLoading) {
      initializeAuth();
    } else if (!isAuthenticated && !isLoading) {
      setUserSettings(null);
    }
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, getAuthOUserInfo, checkAuth0Cookie, login]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (showTerms) {
        handleTermsReject();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showTerms, handleTermsReject]);

  const updateUserSettings = useCallback(
    (newSettings) => {
      if (user) {
        const authOInfo = getAuthOUserInfo(user);
        setUserSettings({ ...newSettings, ...authOInfo });
      } else {
        setUserSettings(newSettings);
      }
    },
    [user, getAuthOUserInfo]
  );
  return (
    <UserSettingsContext.Provider
      value={{ userSettings, setUserSettings: updateUserSettings, showTerms, setShowTerms }}
    >
      {children}
      {showTerms && <TermsOfServiceModal onSubmit={handleTermsSubmit} onClose={handleTermsReject} />}
      {showEmailVerification && (
        <EmailVerificationModal
          open={showEmailVerification}
          email={user?.email}
          onClose={() => setShowEmailVerification(false)}
        />
      )}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};
