import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { destroy, startCountDown } from '../../actions/timer';
//Material UI tailwind css
import { CardContent, CardActions, Typography, Button } from '@mui/material';

const Show = ({
  destroy,
  startCountDown,
  auth,
  timer: { _id, title, user, description, timer, status },
  showActions
}) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(timer) - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  // const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  // Clear timeout if the component is unmounted
  const timerComponents = Object.keys(timeLeft).map((interval) => {
      if (!timeLeft[interval]) {
          return 0;
      }

      return (
          <span key={interval}>
              {timeLeft[interval]} {interval}{" "}
          </span>
      );
  });

  return (
      <>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography>
          {description}
        </Typography>
        <Typography>
          
          {/* Date: {formatDate(timer)} */}
          Date: {timer}
        </Typography>
        {timerComponents.length ? timerComponents : <span> Times Up!</span>}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => destroy(_id)}>Delete</Button>
        {/* <Button size="small" onClick={() => startCountDown(_id)}>Edit</Button> */}
      </CardActions>
      </>
  );
}

Show.defaultProps = {
  showActions: true
};

Show.propTypes = {
  timer: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  destroy: PropTypes.func.isRequired,
  startCountDown: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { destroy, startCountDown })(Show);
