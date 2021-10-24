import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
//material ui
import { Card, CardContent, CardActions, Typography, Button, Container } from '@mui/material';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="/timers" />;
  }

  return (
      <Container>
        <Card>
          <CardContent color="lightBlue">
            <Typography variant="h5" component="div">
              Login
            </Typography>
            <form className="form" onSubmit={onSubmit}>
                <div className="mb-12 px-4 bg-bb">
                    <input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={email}
                      onChange={onChange}
                      required
                    />
                </div>
                <div className="mb-8 px-4">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      minLength="6"
                    />
                </div>
                <div className="mb-4 px-4">
                    <input type="submit" className="btn btn-primary" value="Login" />
                </div>
            </form>
          </CardContent>
          <CardActions>
              <div className="flex justify-center bg-bb">
                  <Button
                      variant='outlined'
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
              </div>
          </CardActions>
        </Card>
      </Container>
    
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
