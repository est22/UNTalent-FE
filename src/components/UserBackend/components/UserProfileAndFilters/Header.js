// components/UserProfile/Header.js
import UserProfileDefault from '../../../../assets/UserProfileIcon.png';
import Skeleton from '@mui/material/Skeleton';
import { Fade } from '@mui/material';

export const Header = ({ isLoading, userProfile }) => (
  <div className="header">
    <h2 className="main-heading">User Profile Settings</h2>
    <div className="intro-section">
      <p>Update your language preferences, education, and experience to better match job listings.</p>
      <div
        className="header-profile"
        style={{
          width: '96px',
          height: '96px',
          position: 'relative',
          marginLeft: '20px',
          flex: 'none',
        }}
      >
        <Fade in={isLoading} timeout={800}>
          <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            {isLoading && (
              <Skeleton
                variant="rectangular"
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </div>
        </Fade>
        <Fade in={!isLoading} timeout={800}>
          <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            {!isLoading && (
              <img
                src={userProfile ? userProfile : UserProfileDefault}
                alt="User Profile Icon"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>
        </Fade>
      </div>
    </div>
  </div>
);
