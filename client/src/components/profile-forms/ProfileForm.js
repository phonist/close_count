import React, { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

//Material-UI 
import H3 from '@material-tailwind/react/Heading3';
import Icon from '@material-tailwind/react/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from "@material-tailwind/react/Input";
import Button from "@material-tailwind/react/Button";

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
    console.log(e.target);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history, profile ? true : false);
  };

  const profileFormStyle = {
    transform: `translateY(50%)`
  }

  return (
    <section className="relative py-16 bg-gray-100">
      <div className="container max-w-7xl px-4 mx-auto" style={profileFormStyle}>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-2xl -mt-64">
          <div className="px-6">
            <div className="text-center my-8">
              <H3 color="gray">
                {creatingProfile ? 'Create Your Profile' : 'Edit Your Profile'}
              </H3>
              <div className="mt-0 mb-2 text-gray-700 font-medium flex items-center justify-center gap-2">
                  <Icon name="place" size="xl" />
                  {creatingProfile
                  ? ` Let's get some information to make your`
                  : ' Add some changes to your profile'}
              </div>
              <small>* = required field</small>
              <form className="form" onSubmit={onSubmit}>
                <FormControl variant="outlined">
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
                <FormControl variant="outlined">
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
                    <small className="form-text">
                      Could be your own company or one you work for
                    </small>
                </FormControl>
                <FormControl variant="outlined">
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
                    <small className="form-text">
                      Could be your own or a company website
                    </small>
                </FormControl>
                <FormControl variant="outlined">
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
                  <small className="form-text">
                    City & state suggested (eg. Boston, MA)
                  </small>
                </FormControl>
                <FormControl variant="outlined">
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
                  <small className="form-text">
                    Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
                  </small>
                </FormControl>
                <FormControl variant="outlined">
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
                  <small className="form-text">
                    If you want your latest repos and a Github link, include your
                    username
                  </small>
                </FormControl>
                <FormControl variant="outlined">
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
                  <small className="form-text">
                    Tell us a little about yourself
                  </small>
                </FormControl>

                <FormControl variant="outlined">
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
                  <small className="form-text">
                    Tell us a little about yourself
                  </small>
                </FormControl>

                <FormControl variant="outlined">
                  <Button
                      color="lightBlue"
                      buttonType="filled"
                      size="regular"
                      rounded={false}
                      block={false}
                      iconOnly={false}
                      ripple="light"
                      onClick={() => toggleSocialInputs(!displaySocialInputs)}
                  >
                      Add Social Networks Links
                  </Button>
                  <span> Optional </span>
                </FormControl>

                {displaySocialInputs && (
                <div>
                  <FormControl variant="outlined">
                      <i className="fab fa-twitter fa-2x" />
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
                  <FormControl variant="outlined">
                      <i className="fab fa-facebook fa-2x" />
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
                  <FormControl variant="outlined">
                      <i className="fab fa-youtube fa-2x" />
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
                  <FormControl variant="outlined">
                      <i className="fab fa-linkedin fa-2x" />
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
                  <FormControl variant="outlined">
                      <i className="fab fa-instagram fa-2x" />
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
                </div>
                )}
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to={`/profile/${user._id}`}>
                  Go Back
                </Link>
              </form>
              
            </div>
          </div>
        </div>
      </div>
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
