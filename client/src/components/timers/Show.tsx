import { useState, useEffect } from 'react';
import { attemptDestroyTimer } from '../../thunks/timer';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { CardContent, CardActions, Typography, Button } from '@mui/material';
import { AppState } from '../../store';
import { Timer } from '../../interfaces/Timer';
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ShowProps {
  timer: Timer;
}

const Show = ({ timer }: ShowProps) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, void, AnyAction>>();
  const calculateTimeLeft = () => {
    const difference = +new Date(timer.timer) - +new Date();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = (Object.keys(timeLeft) as Array<keyof TimeLeft>).map((interval) => {  
      if (!timeLeft[interval]) {
          return null;
      }

      return (
          <span key={interval}>
              {timeLeft[interval]} {interval}{' '}
          </span>
      );
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
            Date: {timer.timer}
          </Typography>
          {timerComponents.length ? timerComponents : <span> Times Up!</span>}
        </CardContent>
        <CardActions>
          {/* <Button size="small" onClick={() => dispatch(attemptDestroyTimer(timer.timer._id))}>Delete</Button> */}
          <Button size="small" onClick={() => dispatch(attemptDestroyTimer(String(timer._id)))}>Delete</Button>
          {/* <Button size="small" onClick={() => startCountDown(_id)}>Edit</Button> */}
        </CardActions>
      </>
  );
}

export default Show;
