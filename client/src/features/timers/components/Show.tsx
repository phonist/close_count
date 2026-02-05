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
  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '00:00:00';
    }
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    const safeDiff = Math.max(0, difference);

    return {
      days: Math.floor(safeDiff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((safeDiff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((safeDiff / 1000 / 60) % 60),
      seconds: Math.floor((safeDiff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const pad = (value: number) => String(value).padStart(2, '0');
  const isTimesUp =
    timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  const timerComponents = (
    [
      ...(timeLeft.days > 0 ? (['days'] as Array<keyof TimeLeft>) : []),
      'hours',
      'minutes',
      'seconds',
    ] as Array<keyof TimeLeft>
  ).map((interval) => (
    <Box key={interval} sx={{ textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1 }}>
        {interval === 'days' ? timeLeft[interval] : pad(timeLeft[interval])}
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
              {timer.isRecurring ? 'Next run' : 'Date'} · {formatDate(targetDate)} · {formatTime(targetDate)}
            </Typography>
            <Divider />
            {isTimesUp ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(248,113,113,0.12), rgba(252,165,165,0.25))',
                  border: '1px solid rgba(248,113,113,0.35)',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main' }}>
                  Time’s up
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This timer has reached its target.
                </Typography>
              </Box>
            ) : (
              <Stack direction="row" spacing={2} justifyContent="space-between">
                {timerComponents}
              </Stack>
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
