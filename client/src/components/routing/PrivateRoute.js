import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from '../common/Loading';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      loading ? (
        <Loading />
      ) : isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Navigate to="/login" />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
