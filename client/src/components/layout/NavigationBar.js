import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth'; 

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';


const NavigationBar = ({ 
  auth: { isAuthenticated, user },
  logout
}) => {
  const [link, setLink] = useState('');
  // const [openNavbar, setOpenNavbar] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user !== null) setLink(`profile/${user._id}`);
    else setLink('');
  }, [isAuthenticated, logout, user]);

  const authLinks = (
    // <NavbarCollapse open={openNavbar}>
    //     <Nav>
    //         <NavLink href="/timers" ripple="light">
    //             <AccountCircle name="account_circle" size="xl" />
    //             Timers
    //         </NavLink>
    //         <NavLink href={link} ripple="light">
    //             <Person name="person" size="xl" />
    //               Your Profile
    //         </NavLink>
    //         <NavItem onClick={logout} ripple="light">
    //             <ExitToApp name="exit_to_app" size="xl" />
    //             Logout
    //         </NavItem>
    //     </Nav>
    // </NavbarCollapse>
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
      >
        <MenuIcon />
        Timers
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Your Profile
      </Typography>
      <Link color="inherit" href={link}> Your Profile </Link>
      <Button color="inherit" onClick={logout}>Logout</Button>
    </Toolbar>
  );

  const guestLinks = (
    // <NavbarCollapse open={openNavbar}>
    //     <Nav>
    //         <NavLink href="/register" ripple="light">
    //             Register
    //         </NavLink>
    //         <NavLink href="/login" ripple="light">
    //             Login
    //         </NavLink>
    //     </Nav>
    // </NavbarCollapse>
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
      >
        <MenuIcon />
        Timers
      </IconButton>
      <Link color="inherit" href='/register'>Logout</Link>
      <Link color="inherit" href='/login'>Logout</Link>
    </Toolbar>
  );

  return (
    // <Navbar color="lightBlue" navbar>
    //     <NavbarContainer>
    //         <NavbarWrapper>
    //             <NavbarBrand>
    //               <NavLink href="/">
    //                 <Timer name="timer" size="xl" />
    //                 Close Count
    //               </NavLink>
    //             </NavbarBrand>
    //             <NavbarToggler
    //                 color="white"
    //                 onClick={() => setOpenNavbar(!openNavbar)}
    //                 ripple="light"
    //             />
    //         </NavbarWrapper>
        
    //         {isAuthenticated ? authLinks : guestLinks}
    
    //     </NavbarContainer>
    // </Navbar>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
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
