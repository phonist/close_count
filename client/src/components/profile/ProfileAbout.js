import React from 'react';
import PropTypes from 'prop-types';
//Material-UI 
import { Button, Typography } from '@mui/material';

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name }
  }
}) => {
  return (
    <div className="mb-10 py-2 border-t border-gray-200 text-center">
        <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-9/12 px-4 flex flex-col items-center">
                
                {bio && (
                  <Typography color="blueGray">
                    <h2 className='text-primary'>{name.trim().split(' ')[0]}s Bio</h2>
                    <p>{bio}</p>
                    <div className='line' />
                  </Typography>   
                )}
                <h2 className='text-primary'>Skill Set</h2>
                <div className='skills'>
                  {skills.map((skill, index) => (
                    <div key={index} className='p-1'>
                      <i className='fas fa-check' /> {skill}
                    </div>
                  ))}
                </div>
                <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                >
                    <Button
                       variant='outlined'
                    >
                        Show more
                    </Button>
                </a>
            </div>
        </div>
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
