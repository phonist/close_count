import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth'; 

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';


const NavigationBar = ({ 
  auth: { isAuthenticated, user },
  logout
}) => {
  const authLinks = (
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        <Link href="/timers" color="inherit" underline='none'>
          Close count
        </Link>
      </Typography>
      <nav>
        <Button href="#" variant="outlined" onClick={logout} sx={{ my: 1, mx: 1.5 }}>
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
        {isAuthenticated ? authLinks : guestLinks}
      </AppBar>
    </Box>
  );
};

NavigationBar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(NavigationBar);
