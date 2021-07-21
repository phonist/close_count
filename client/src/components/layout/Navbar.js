import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth'; 

const Navbar = ({ 
  auth: { isAuthenticated, user },
  logout
}) => {
  const [link, setLink] = useState('');

  useEffect(() => {
    if (isAuthenticated && user !== null) setLink(`profile/${user._id}`);
    else setLink('');
  }, [isAuthenticated, logout, user]);

  const authLinks = (
    <ul>
      <li>
        <i className="fas fa-clock" />
        <Link to="/timers">Timers</Link>
      </li>
      <li>
        <Link to= {link}>
          <i className="fas fa-user" /> Your Profile
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code" /> Close Count
        </Link>
      </h1>
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
