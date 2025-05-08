import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { UserSettingsProvider } from './UserSettingsContext';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginGate from './components/LoginGate';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Root() {
  const [isTempAuthenticated, setIsTempAuthenticated] = useState(false);

  const handleTempLoginSuccess = () => {
    setIsTempAuthenticated(true);
  };

  const handleTempLogout = () => {
    setIsTempAuthenticated(false);
  };

  return (
    <React.StrictMode>
      {!isTempAuthenticated ? (
        <LoginGate onLoginSuccess={handleTempLoginSuccess} />
      ) : (
        <Router>
          <Auth0Provider
            cocookieDomain={window.location.hostname}
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            authorizationParams={{
              redirect_uri: window.location.origin,
              prompt: 'login',
              audience: process.env.REACT_APP_AUTH0_AUDIENCE,
              scope: 'openid profile email offline_access',
            }}
            useRefreshTokens={true}
            useRefreshTokensFallback={true}
          >
            <UserSettingsProvider>
              <App onTempLogout={handleTempLogout} />
            </UserSettingsProvider>
          </Auth0Provider>
        </Router>
      )}
    </React.StrictMode>
  );
}

root.render(<Root />);
