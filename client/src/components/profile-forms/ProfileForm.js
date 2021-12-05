import React, { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

//MUI
import { InputLabel, FormControl, Select, Input, Button, Grid, Typography } from '@mui/material';


// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   control: {
//     padding: theme.spacing(2),
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
// }));

const initialState = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubusername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  instagram: ''
};

const ProfileForm = ({
  auth: { user },
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history
}) => {
  // const classes = useStyles();

  const [formData, setFormData] = useState(initialState);

  const creatingProfile = useRouteMatch('/create-profile');

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(', ');
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history, profile ? true : false);
  };

  const profileFormStyle = {
    transform: `translateY(30%)`
  }

  return (
    <section className="relative py-16 bg-gray-100">
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={8}>
          <div className="container max-w-7xl px-4 mx-auto" style={profileFormStyle}>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-2xl -mt-64">
              <div className="px-6">
                {/* <div className="text-center my-8"> */}
                  <Grid container direction="column" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="h3" gutterBottom component="div">
                      {creatingProfile ? 'Create Your Profile' : 'Edit Your Profile'}
                    </Typography>
                    <Typography className="mt-0 mb-2 text-gray-700 font-medium flex items-center justify-center gap-2">
                        {/* <Icon name="place" size="xl" /> */}
                        {creatingProfile
                        ? ` Let's get some information to make your`
                        : ' Add some changes to your profile'}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom>
                    * = required field
                    </Typography>
                  </Grid>
                  <Grid container direction="column" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <form className="form" onSubmit={onSubmit}>
                      <Grid item xs={12}>
                        <FormControl>
                          <InputLabel id="demo-simple-select-label" >Status</InputLabel>  
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            name="status"
                            onChange={onChange}
                          >
                            <option value=''>* Select Professional Status</option>
                            <option value='Developer'>Developer</option>
                            <option value='Junior Developer'>Junior Developer</option>
                            <option value='Senior Developer'>Senior Developer</option>
                            <option value='Manager'>Manager</option>
                            <option value='Student or Learning'>Student or Learning</option>
                            <option value='Instructor'>Instructor</option>
                            <option value='Intern'>Intern</option>
                            <option value='Other'>Other</option>
                            <option value=''>Give us an idea of where you are at in your career</option>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                          <Input
                              color="lightBlue"
                              size="regular"
                              outline={false}
                              type="text"
                              placeholder="Company"
                              name="company"
                              value={company}
                              onChange={onChange}
                          />
                          <Typography variant="caption" display="block" gutterBottom>
                            Could be your own company or one you work for
                          </Typography>

                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                            <Input
                              color="lightBlue"
                              size="regular"
                              outline={false}
                              type="text"
                              placeholder="Website"
                              name="webiste"
                              value={website}
                              onChange={onChange}
                            />
                            <Typography variant="caption" display="block" gutterBottom>
                              Could be your own or a company website
                            </Typography>

                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                          <Input
                              color="lightBlue"
                              size="regular"
                              outline={false}
                              type="text"
                              placeholder="Location"
                              name="location"
                              value={location}
                              onChange={onChange}
                          />
                          <Typography variant="caption" display="block" gutterBottom>
                            City & state suggested (eg. Boston, MA)
                          </Typography>

                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                          <Input
                              color="lightBlue"
                              size="regular"
                              outline={false}
                              type="text"
                              placeholder="* Skills"
                              name="skills"
                              value={skills}
                              onChange={onChange}
                          />
                          <Typography variant="caption" display="block" gutterBottom>
                            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
                          </Typography>

                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                          <Input
                              color="lightBlue"
                              size="regular"
                              outline={false}
                              type="text"
                              placeholder="Github Username"
                              name="githubusername"
                              value={githubusername}
                              onChange={onChange}
                          />
                          <Typography variant="caption" display="block" gutterBottom>
                            If you want your latest repos and a Github link, include your username
                          </Typography>

                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                          <Input
                              color="lightBlue"
                              size="regular"
                              outline={false}
                              type="text"
                              placeholder="A short bio of yourself"
                              name="bio"
                              value={bio}
                              onChange={onChange}
                          />
                          <Typography variant="caption" display="block" gutterBottom>
                            Tell us a little about yourself
                          </Typography>

                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                          <Input
                              color="lightBlue"
                              size="regular"
                              outline={false}
                              type="text"
                              placeholder="A short bio of yourself"
                              name="bio"
                              value={bio}
                              onChange={onChange}
                          />
                          <Typography variant="caption" display="block" gutterBottom>
                            Tell us a litte about yourself
                          </Typography>

                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl>
                          <Button
                              variant='outlined'
                              onClick={() => toggleSocialInputs(!displaySocialInputs)}
                          >
                              Add Social Networks Links
                          </Button>
                          <span> Optional </span>
                        </FormControl>
                      </Grid>
              
                      {displaySocialInputs && (
                        <>
                          <Grid item xs={12}>
                            <i className="fab fa-twitter fa-2x" />
                            <FormControl>
                              <Input
                                color="lightBlue"
                                size="regular"
                                outline={false}
                                type="text"
                                placeholder="Twitter URL"
                                name="twitter"
                                value={twitter}
                                onChange={onChange}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <i className="fab fa-facebook fa-2x" />
                            <FormControl>
                              <Input
                                color="lightBlue"
                                size="regular"
                                outline={false}
                                type="text"
                                placeholder="Facebook URL"
                                name="facebook"
                                value={facebook}
                                onChange={onChange}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <i className="fab fa-youtube fa-2x" />
                            <FormControl>
                              <Input
                                color="lightBlue"
                                size="regular"
                                outline={false}
                                type="text"
                                placeholder="YouTube URL"
                                name="youtube"
                                value={youtube}
                                onChange={onChange}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <i className="fab fa-linkedin fa-2x" />
                            <FormControl>
                                <Input
                                  color="lightBlue"
                                  size="regular"
                                  outline={false}
                                  type="text"
                                  placeholder="Linkedin URL"
                                  name="linkedin"
                                  value={linkedin}
                                  onChange={onChange}
                                />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <i className="fab fa-instagram fa-2x" />
                            <FormControl>
                              <Input
                                color="lightBlue"
                                size="regular"
                                outline={false}
                                type="text"
                                placeholder="Instagram URL"
                                name="instagram"
                                value={instagram}
                                onChange={onChange}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                      <input type="submit" className="btn btn-primary my-1" />
                      <Link className="btn btn-light my-1" to={`/profile/${user._id}`}>
                        Go Back
                      </Link>
                    </form>
                  </Grid>
                {/* </div> */}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </section>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
);
