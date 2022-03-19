import React, { useState, useEffect } from 'react';
import { attemptDestroyTimer } from '../../thunks/timer';
//Material UI tailwind css
import { CardContent, CardActions, Typography, Button } from '@mui/material';

// const Show = ({
//   destroy,
//   startCountDown,
//   auth,
//   timer: { _id, title, user, description, timer, status },
//   showActions
// }) => {

interface TimeLeft {
  days: Number,
  hours: Number,
  minutes: Number,
  seconds: Number
}

const Show = (timer: any) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(timer) - +new Date();

    let timeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

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
  const timerComponents = Object.keys(timeLeft).map(( interval ) => {
      // if (!timeLeft[interval]) {
      //     return 0;
      // }

      // return (
      //     <span key={interval}>
      //         {timeLeft[interval]} {interval}{" "}
      //     </span>
      // );
  });

  return (
      <>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {timer.title}
        </Typography>
        <Typography>
          {timer.description}
        </Typography>
        <Typography>
          
          {/* Date: {formatDate(timer)} */}
          Date: {timer}
        </Typography>
        {timerComponents.length ? timerComponents : <span> Times Up!</span>}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => attemptDestroyTimer(timer._id)}>Delete</Button>
        {/* <Button size="small" onClick={() => startCountDown(_id)}>Edit</Button> */}
      </CardActions>
      </>
  );
}

export default Show;
