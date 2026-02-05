import { useState, useEffect } from 'react';
import { attemptDestroyTimer } from '../thunks';
import { useAppDispatch } from '../../../app/hooks';
import {
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import { Timer } from '../types';
import formatDate from '../../../shared/utils/formatDate';
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
  const dispatch = useAppDispatch();
  const targetDate = timer.nextRunAt ?? timer.timer;
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();

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

  const timerComponents = (Object.keys(timeLeft) as Array<keyof TimeLeft>)
    .filter((interval) => timeLeft[interval] > 0)
    .map((interval) => (
      <Box key={interval} sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1 }}>
          {timeLeft[interval]}
        </Typography>
        <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {interval}
        </Typography>
      </Box>
    ));

  return (
      <>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {timer.title}
              </Typography>
              {timer.isRecurring && <Chip size="small" label="Recurring" />}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {timer.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timer.isRecurring ? 'Next run' : 'Date'} · {formatDate(targetDate)}
            </Typography>
            <Divider />
            {timerComponents.length ? (
              <Stack direction="row" spacing={2} justifyContent="space-between">
                {timerComponents}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Times Up!
              </Typography>
            )}
          </Stack>
        </CardContent>
        <CardActions>
          {/* <Button size="small" onClick={() => dispatch(attemptDestroyTimer(timer.timer._id))}>Delete</Button> */}
          <Button
            size="small"
            color="error"
            onClick={() => dispatch(attemptDestroyTimer(String(timer._id)))}
          >
            Delete
          </Button>
          {/* <Button size="small" onClick={() => startCountDown(_id)}>Edit</Button> */}
        </CardActions>
      </>
  );
}

export default Show;
