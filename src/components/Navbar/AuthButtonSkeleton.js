import React from 'react';
import { Skeleton } from '@mui/material';

export const AuthButtonSkeleton = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="auth-button">
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          animation="wave"
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&::after': {
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
            }
          }}
        />
      </div>
    );
  }

  return (
    <Skeleton
      variant="rectangular"
      width={80}
      height={36}
      animation="wave"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        '&::after': {
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
        }
      }}
    />
  );
};