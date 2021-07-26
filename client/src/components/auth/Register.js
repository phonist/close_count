import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
//material ui
//material ui
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import CardFooter from '@material-tailwind/react/CardFooter';
import H5 from '@material-tailwind/react/Heading5';
import Button from '@material-tailwind/react/Button';
import Container from '../layout/Container';

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
        <CardHeader color="lightBlue">
            <H5 color="white" style={{ marginBottom: 0 }}>
                Register
            </H5>
        </CardHeader>
        <CardBody>
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
          
        </CardBody>
        <CardFooter>
            <div className="flex justify-center">
                <Button
                    color="lightBlue"
                    buttonType="link"
                    size="lg"
                    ripple="dark"
                >
                    <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
                </Button>
            </div>
        </CardFooter>
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
