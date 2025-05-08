import React, { useState } from 'react';
import './LoginGate.css'; // CSS 파일 임포트
// Import the logo - adjust path if necessary
import undpLogoBlue from '../assets/UNDP-Logo-Blue-Large.png';

const TEMP_USERNAME = 'testuser'; // 임시 사용자 이름
const TEMP_PASSWORD = 'password'; // 임시 비밀번호

function LoginGate({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === TEMP_USERNAME && password === TEMP_PASSWORD) {
      setError('');
      sessionStorage.setItem('isTempAuthenticated', 'true');
      onLoginSuccess();
    } else {
      setError('Invalid ID or password');
    }
  };

  return (
    <div className="login-gate-container">
      <div className="login-box">
        {/* Added UNDP Logo */}
        <img src={undpLogoBlue} alt="UNDP Logo" className="login-logo" />
        <h2>UN Talent Connect</h2> {/* Changed title */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">ID:</label> {/* Changed label */}
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`Hint: ${TEMP_USERNAME}`} // 개발 편의를 위한 힌트
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`Hint: ${TEMP_PASSWORD}`} // 개발 편의를 위한 힌트
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
         <p className="disclaimer">
            Note: This is a temporary login for demo purposes only. <br/>
            Credentials: {TEMP_USERNAME} / {TEMP_PASSWORD}
         </p>
      </div>
    </div>
  );
}

export default LoginGate; 