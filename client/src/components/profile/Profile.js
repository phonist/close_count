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

import { Button, Avatar, Grid, Card, CardContent } from '@mui/material';

const Profile = ({ getProfileById, profile: { profile }, auth, match }) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (
    <>
    {profile === null ? (
      <>
      <Spinner />
      </>
    ):(
      <>
      
      <ProfileHeader/>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={11}>
          <Card>
            <CardContent>
              <Avatar
                  src={profile.user.avatar}
                  alt="Profile picture"
              />
              
              <Grid container>
                <Grid container item xs={12} spacing={1}>
                  {auth.isAuthenticated &&
                  auth.loading === false &&
                  auth.user._id === profile.user._id && (
                    <Button variant='outlined'>
                      <Link to="/edit-profile" className="btn btn-dark">
                        Edit Profile
                      </Link>
                    </Button>
                  )}
                </Grid>
              </Grid>
              <Grid contaienr>
                <Grid container item xs={12} spacing={1}>
                  <ProfileTop profile={profile} />
                </Grid>
              </Grid>
              <Grid contaienr>
                <Grid container item xs={12} spacing={1}>
                  <ProfileAbout profile={profile} />

                </Grid>
              </Grid>
              <Grid contaienr>
                  <Grid container item xs={12} justifyContent="flex-end" spacing={1}>
                    {profile.githubusername && (
                      <ProfileGithub username={profile.githubusername} />
                    )}
                  </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
