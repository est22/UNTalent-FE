import React from 'react';
import { Container, Box, Button, Typography, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useAuth from '../hooks/useAuth';
import './Login.css';

const LoginPage = () => {
  const { handleLogin } = useAuth();

  return (
    <Box className="login-background">
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper className="login-paper" elevation={6}>
            <Box className="login-icon-wrapper">
              <LockOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>

            <Typography component="h1" variant="h5" className="login-title">
              Log in / Sign up
            </Typography>

            <Button onClick={handleLogin} fullWidth variant="contained" className="login-page-button">
              Continue with Auth0
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
