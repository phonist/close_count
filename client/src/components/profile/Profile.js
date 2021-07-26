import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileGithub from './ProfileGithub';
import { getProfileById } from '../../actions/profile';
//Material-UI 
import ProfileHeader from './ProfileHeader';
import Button from '@material-tailwind/react/Button';
import Image from '@material-tailwind/react/Image';

const Profile = ({ getProfileById, profile: { profile }, auth, match }) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);
  
  const profileStyle = {
    transform: `translateY(30%)`
  }

  return (
    <>
    {profile === null ? (
      <>
      <Spinner />
      </>
    ):(
      <>
      <ProfileHeader/>
      <section className="relative py-16 bg-gray-100">
          <div className="container max-w-7xl px-4 mx-auto" style={profileStyle}>
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-2xl -mt-64">
                  <div className="px-6">
                      <div className="flex flex-wrap justify-center">
                          <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                              <div className="relative">
                                  <div className="w-40 -mt-20">
                                      <Image
                                          src={profile.user.avatar}
                                          alt="Profile picture"
                                          raised
                                          rounded
                                      />
                                  </div>
                              </div>
                          </div>
                          <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:self-center flex justify-center mt-10 lg:justify-end lg:mt-0">
                              
                              {auth.isAuthenticated &&
                                auth.loading === false &&
                                auth.user._id === profile.user._id && (
                                  <Button color="lightBlue" ripple="light">
                                    <Link to="/edit-profile" className="btn btn-dark">
                                      Edit Profile
                                    </Link>
                                  </Button>
                                )}

                          </div>
                      </div>

                      <ProfileTop profile={profile} />
                      <ProfileAbout profile={profile} />
                      {profile.githubusername && (
                        <ProfileGithub username={profile.githubusername} />
                      )}
                  </div>
              </div>
          </div>
      </section>
      </>
    )}
    </>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);
