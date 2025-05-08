// hooks/useAuth.js
import { useAuth0 } from '@auth0/auth0-react';
import { callApi } from '../utils/apiHandler';
import { useNavigate } from 'react-router-dom';
const useAuth = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading, error } = useAuth0();
  const navigate = useNavigate();
  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleSignUp = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await callApi.post('/auth/logout', null, false, true);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout({ returnTo: window.location.origin });
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    handleLogin,
    handleSignUp,
    handleLogout,
  };
};

export default useAuth;
