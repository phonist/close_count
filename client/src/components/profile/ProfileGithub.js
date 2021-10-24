import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../actions/profile';
//Material-UI 
import { Typography } from '@mui/material';
import Icon from '@mui/material/Icon';


const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);

  return (
    <div className="text-center my-8">
      <Typography variant="h3" gutterBottom component="div">
        Github repos
      </Typography>
      {repos.map(repo => (
        <div key={repo.id} className="repo bg-white p-1 my-1">
          <div className="mt-0 mb-2 text-gray-700 font-medium flex items-center justify-center gap-2">
              <Icon> Place </Icon>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
              <p>{repo.description}</p>
          </div>
          <div className="mb-2 text-gray-700 mt-10 flex items-center justify-center gap-2">
              <Icon name="work" size="xl" />
              <li className="badge badge-primary">
                Stars: {repo.stargazers_count}
              </li>
              <li className="badge badge-dark">
                Watchers: {repo.watchers_count}
              </li>
              <li className="badge badge-light">Forks: {repo.forks_count}</li>
          </div>
        </div>
      ))}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  repos: state.profile.repos
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
