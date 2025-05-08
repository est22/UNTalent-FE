import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import AuthRoute from './components/AuthRoute';
// import Signup from './components/Signup'; // Already removed
import LoginPage from './pages/Login';
import UserBackend from './components/UserBackend/UserBackend';
import SimpleHeader from './components/SimpleHeader';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './components/MainPage/MainPage';
import NotFound from './components/NotFoundPage';
import Footer from './components/Footer'; // Import the Footer component
import { CssBaseline } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
// import AuthDebugger from './components/AuthDebugger';

function App({ onTempLogout }) {
  const location = useLocation(); // Get the current location
  // const isUserBackend = location.pathname === '/user-backend';
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <CssBaseline />
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="App">
        {isLoginPage ? <SimpleHeader /> : <Navbar onTempLogout={onTempLogout} />}
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route
            path="/profile/*"
            element={
              <ProtectedRoute>
                <UserBackend />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<MainPage />} />
          {/* If there are more routes, they go here */}
          <Route path="*" element={<NotFound />} /> {/* Catch-all for unmatched routes */}
        </Routes>
        <Footer /> {/* Footer added here, it will be displayed on all pages */}
      </div>
    </>
  );
}

export default App;
