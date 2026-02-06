import { useState, useEffect } from 'react';
import { attemptDestroyTimer, attemptAdvanceTimer } from '../thunks';
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
  const nextRunAt = timer.nextRunAt ?? null;
  const computeNextRunAt = () => {
    if (!timer.recurrence) {
      return null;
    }
    const startAt = new Date(timer.timer);
    if (Number.isNaN(startAt.getTime())) {
      return null;
    }
    const now = new Date();
    const interval = Math.max(1, timer.recurrence.interval ?? 1);

    if (timer.recurrence.frequency === 'daily') {
      let next = new Date(startAt);
      while (next <= now) {
        next.setDate(next.getDate() + interval);
      }
      return next.toISOString();
    }

    if (timer.recurrence.frequency === 'weekly') {
      const daysOfWeek =
        timer.recurrence.daysOfWeek && timer.recurrence.daysOfWeek.length > 0
          ? timer.recurrence.daysOfWeek
          : [startAt.getDay()];
      const baseTime = new Date(startAt);
      const cursor = new Date(now.getTime() + 1000);
      if (cursor < startAt) {
        cursor.setTime(startAt.getTime());
      }
      cursor.setHours(
        baseTime.getHours(),
        baseTime.getMinutes(),
        baseTime.getSeconds(),
        baseTime.getMilliseconds()
      );
      const maxDays = 365 * 5;
      for (let i = 0; i < maxDays; i += 1) {
        const weeksBetween = Math.floor(
          (cursor.getTime() -
            new Date(startAt.getFullYear(), startAt.getMonth(), startAt.getDate()).getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        );
        if (weeksBetween % interval === 0 && daysOfWeek.includes(cursor.getDay())) {
          if (cursor > now) {
            return cursor.toISOString();
          }
        }
        cursor.setDate(cursor.getDate() + 1);
        cursor.setHours(
          baseTime.getHours(),
          baseTime.getMinutes(),
          baseTime.getSeconds(),
          baseTime.getMilliseconds()
        );
      }
      return null;
    }

    const dayOfMonth = startAt.getDate();
    const baseMonthIndex = startAt.getFullYear() * 12 + startAt.getMonth();
    const maxIterations = 12 * 10;
    for (let i = 0; i < maxIterations; i += 1) {
      const monthIndex = baseMonthIndex + i * interval;
      const year = Math.floor(monthIndex / 12);
      const month = monthIndex % 12;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const cappedDay = Math.min(dayOfMonth, daysInMonth);
      const candidate = new Date(year, month, cappedDay);
      candidate.setHours(
        startAt.getHours(),
        startAt.getMinutes(),
        startAt.getSeconds(),
        startAt.getMilliseconds()
      );
      if (candidate < startAt) {
        continue;
      }
      if (candidate > now) {
        return candidate.toISOString();
      }
    }
    return null;
  };
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
  const [isTimesUp, setIsTimesUp] = useState(false);
  const now = new Date();
  const nextRunAtDate = nextRunAt ? new Date(nextRunAt) : null;
  const shouldComputeNext =
    timer.isRecurring && (!nextRunAtDate || Number.isNaN(nextRunAtDate.getTime()) || nextRunAtDate <= now);
  const displayNextRunAt = shouldComputeNext ? computeNextRunAt() : nextRunAt;

  useEffect(() => {
    const isZero =
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0;
    setIsTimesUp(isZero);
  }, [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  const handleStartNext = () => {
    dispatch(attemptAdvanceTimer(String(timer._id)));
  };

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
              {timer.isRecurring
                ? displayNextRunAt
                  ? `Next run · ${formatDate(displayNextRunAt)} · ${formatTime(displayNextRunAt)}`
                  : 'Next run pending'
                : `Date · ${formatDate(targetDate)} · ${formatTime(targetDate)}`}
            </Typography>
            <Divider />
            {isTimesUp ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(191,219,254,0.4))',
                  border: '1px solid rgba(59,130,246,0.25)',
                }}
              >
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip size="small" label="Completed" />
                    {timer.isRecurring && <Chip size="small" label="Ready for next run" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {timer.isRecurring
                      ? 'This run has completed.'
                      : 'This timer has reached its target.'}
                  </Typography>
                  {timer.isRecurring && (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {displayNextRunAt
                          ? `Next run: ${formatDate(displayNextRunAt)} · ${formatTime(
                              displayNextRunAt
                            )}`
                          : 'Next run pending'}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                        onClick={handleStartNext}
                      >
                        Start next
                      </Button>
                    </>
                  )}
                </Stack>
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
