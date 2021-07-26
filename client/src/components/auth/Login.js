import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
//material ui
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import CardFooter from '@material-tailwind/react/CardFooter';
import H5 from '@material-tailwind/react/Heading5';
import Button from '@material-tailwind/react/Button';
import Container from '../layout/Container';

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
          <CardHeader color="lightBlue">
              <H5 color="white" style={{ marginBottom: 0 }}>
                  Login
              </H5>
          </CardHeader>
          <CardBody>
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
          </CardBody>
          <CardFooter>
              <div className="flex justify-center bg-bb">
                  <Button
                      color="lightBlue"
                      buttonType="link"
                      size="lg"
                      ripple="dark"
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
              </div>
          </CardFooter>
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
