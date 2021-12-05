import React from 'react';
import PropTypes from 'prop-types';
//Material-UI 
import { Typography } from '@mui/material';
import Icon from '@mui/material/Icon';

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar }
  }
}) => {
  return (
    <div className="text-center my-8">
      <Typography variant="h3" gutterBottom component="div">
        {name}
      </Typography>
      <div className="mt-0 mb-2 text-gray-700 font-medium flex items-center justify-center gap-2">
          <Icon name="place" size="xl" />
          {location ? <span>{location}</span> : null}
      </div>
      <div className="mb-2 text-gray-700 mt-10 flex items-center justify-center gap-2">
          <Icon> Work </Icon>
          {website ? (
            <a href={website} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe fa-2x" />
            </a>
          ) : null}
      </div>
      <div className="mb-2 text-gray-700 flex items-center justify-center gap-2">
          <Icon name="account_balance" size="xl" />
          {social
          ? Object.entries(social)
              .filter(([_, value]) => value)
              .map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab fa-${key} fa-2x`}></i>
                </a>
              ))
          : null}
      </div>
    </div>

  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
