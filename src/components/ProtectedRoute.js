import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { checkCookiesValue } from '../utils/cookie';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const auth0User = checkCookiesValue('auth0')

  useEffect(() => {
    if (!isAuthenticated && !auth0User) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, auth0User, navigate]);

  if (isLoading) return <Loading />;
  return children;
};

export default ProtectedRoute;
