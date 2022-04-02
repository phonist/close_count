import React from 'react';
import { attemptLogout } from '../../thunks/auth'; 

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { AppState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

const NavigationBar = (props: any) => {
  const dispatch = useDispatch();
  const auth = useSelector((state:AppState) => state.auth);

  const handleLogout = (e: any) => {
    e.preventDefault();
    dispatch(attemptLogout(auth));
    return <Navigate to="/login" />;
  };

  const authLinks = (
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        <Link href="/timers" color="inherit" underline='none'>
          Close count
        </Link>
      </Typography>
      <nav>
        <Button href="#" variant="outlined" onClick={handleLogout} sx={{ my: 1, mx: 1.5 }}>
          Logout
        </Button>
      </nav>
    </Toolbar>
  );

  const guestLinks = (
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        Close count
      </Typography>
      <nav>
        <Link
          variant="button"
          color="text.primary"
          href="/register"
          sx={{ my: 1, mx: 1.5 }}
          underline='none'
        >
          Register
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="/login"
          sx={{ my: 1, mx: 1.5 }}
          underline='none'
        >
          Login
        </Link>
      </nav>
    </Toolbar>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        
      </AppBar>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        {auth.authenticated ? authLinks : guestLinks}
      </AppBar>
    </Box>
  );
};

export default NavigationBar;
