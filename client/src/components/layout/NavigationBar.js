import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth'; 
import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarBrand from "@material-tailwind/react/NavbarBrand";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import NavLink from "@material-tailwind/react/NavLink";
// import Icon from "@material-tailwind/react/Icon";
import NavItem from "@material-tailwind/react/NavItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Person from "@material-ui/icons/Person";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Timer from "@material-ui/icons/Timer";

const NavigationBar = ({ 
  auth: { isAuthenticated, user },
  logout
}) => {
  const [link, setLink] = useState('');
  const [openNavbar, setOpenNavbar] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user !== null) setLink(`profile/${user._id}`);
    else setLink('');
  }, [isAuthenticated, logout, user]);

  const authLinks = (
    <NavbarCollapse open={openNavbar}>
        <Nav>
            <NavLink href="/timers" ripple="light">
                <AccountCircle name="account_circle" size="xl" />
                Timers
            </NavLink>
            <NavLink href={link} ripple="light">
                <Person name="person" size="xl" />
                  Your Profile
            </NavLink>
            <NavItem onClick={logout} ripple="light">
                <ExitToApp name="exit_to_app" size="xl" />
                Logout
            </NavItem>
        </Nav>
    </NavbarCollapse>
  );

  const guestLinks = (
    <NavbarCollapse open={openNavbar}>
        <Nav>
            <NavLink href="/register" ripple="light">
                Register
            </NavLink>
            <NavLink href="/login" ripple="light">
                Login
            </NavLink>
        </Nav>
    </NavbarCollapse>
  );

  return (
    <Navbar color="lightBlue" navbar>
        <NavbarContainer>
            <NavbarWrapper>
                <NavbarBrand>
                  <NavLink href="/">
                    <Timer name="timer" size="xl" />
                    Close Count
                  </NavLink>
                </NavbarBrand>
                <NavbarToggler
                    color="white"
                    onClick={() => setOpenNavbar(!openNavbar)}
                    ripple="light"
                />
            </NavbarWrapper>
        
            {isAuthenticated ? authLinks : guestLinks}
    
        </NavbarContainer>
    </Navbar>
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
