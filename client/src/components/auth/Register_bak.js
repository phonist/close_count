import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
//material ui
//material ui
import { Card, CardContent, CardActions, Typography, Button, Container } from '@mui/material';


const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/timers" />;
  }

  return (
    <Container>
      <Card>
        <CardContent color="lightBlue">
          <Typography variant="h5" component="div">
            Register
          </Typography>
          <form className="form" onSubmit={onSubmit}>
            <div className="mb-10 px-4">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>
            <div className="mb-10 px-4">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
              />
              <small className="form-text">
                This site uses Gravatar so if you want a profile image, use a
                Gravatar email
              </small>
            </div>
            <div className="mb-4 px-4">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>
            <div className="mb-4 px-4">
              <input
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={onChange}
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Register" />
          </form>
          
        </CardContent>
        <CardActions>
            <div className="flex justify-center">
                <Button
                    variant='outlined'
                >
            <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
            </p>
                </Button>
            </div>
        </CardActions>
      </Card>
    </Container>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
