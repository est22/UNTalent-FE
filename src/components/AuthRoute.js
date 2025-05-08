import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkCookiesValue } from '../utils/cookie';
import Loading from './Loading';

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  const auth0User = checkCookiesValue('auth0')

  useEffect(() => {
    if (auth0User) {
      navigate('/', { replace: true });
    }
  }, [auth0User, navigate]);

  if (auth0User) {
    return <Loading />;
  }

  return children;
};

export default AuthRoute;
