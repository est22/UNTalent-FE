// components/LoadingScreen.js
import { Box, CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 160px)',
        background: 'inherit',
      }}
    >
      <CircularProgress
        size={50}
        sx={{
          color: 'primary.main',
        }}
      />
    </Box>
  );
};

export default Loading;
