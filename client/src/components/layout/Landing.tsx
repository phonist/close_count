import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';

const Landing = () => {
  const auth = useSelector((state: AppState) => state.auth);

  if (auth.isAuthenticated) {
    return <Navigate to='/timers' />;
  }

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Time Keeper</h1>
          <p className='lead'>
            Create count down timer for fun
          </p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
