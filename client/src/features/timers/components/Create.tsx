import { useState } from 'react';
import { attemptStoreTimer } from '../thunks';
//Material-UI
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Input,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';

const getLocalTimezoneOffset = () => {
  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const minutes = String(abs % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

const Create = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timer: Date(),
    isRecurring: false,
    frequency: 'daily' as RecurrenceFrequency,
    interval: 1,
    daysOfWeek: [] as number[],
    dayOfMonth: 1,
    timezone: getLocalTimezoneOffset(),
  });

  const {
    title,
    description,
    timer,
    isRecurring,
    frequency,
    interval,
    daysOfWeek,
    dayOfMonth,
    timezone,
  } = formData;

  const onChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFrequencyChange = (e: any) =>
    setFormData({
      ...formData,
      frequency: e.target.value as RecurrenceFrequency,
    });

  const onToggleRecurring = (e: any) =>
    setFormData({ ...formData, isRecurring: e.target.checked });

  const onIntervalChange = (e: any) =>
    setFormData({ ...formData, interval: Number(e.target.value) });

  const onDayOfMonthChange = (e: any) =>
    setFormData({ ...formData, dayOfMonth: Number(e.target.value) });

  const toggleDayOfWeek = (day: number) => {
    if (daysOfWeek.includes(day)) {
      setFormData({ ...formData, daysOfWeek: daysOfWeek.filter((d) => d !== day) });
      return;
    }
    setFormData({ ...formData, daysOfWeek: [...daysOfWeek, day] });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const recurrence = isRecurring
      ? {
          frequency,
          interval: Number(interval) || 1,
          ...(frequency === 'weekly' ? { daysOfWeek } : {}),
          ...(frequency === 'monthly' ? { dayOfMonth: Number(dayOfMonth) || 1 } : {}),
        }
      : undefined;
    const payload = {
      title,
      description,
      timer,
      isRecurring,
      recurrence,
      timezone: isRecurring ? timezone : undefined,
    };
    dispatch(attemptStoreTimer(payload));
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={10}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
            Set Timer
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={1}>
                  <Grid container item xs={3} spacing={1}>
                    <Input
                      placeholder='Title'
                      id="title"
                      type="string"
                      name="title"
                      value={title}
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid container item xs={3} spacing={1}>
                    <Input
                      placeholder='Description'
                      id="description"
                      type="string"
                      name="description"
                      value={description}
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid container item xs={3} spacing={1}>
                    <Input
                      placeholder='Timer'
                      id="timer"
                      type="date"
                      name="timer"
                      value={timer}
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid container item xs={3} justifyContent="flex-end" spacing={1}>
                    <Button 
                      variant='outlined'
                      type='submit'>
                      Add Timer
                    </Button>
                  </Grid>
                  <Grid container item xs={12} spacing={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isRecurring}
                          onChange={onToggleRecurring}
                        />
                      }
                      label="Recurring"
                    />
                  </Grid>
                  {isRecurring && (
                    <>
                      <Grid container item xs={3} spacing={1}>
                        <FormControl fullWidth>
                          <InputLabel id="frequency-label">Frequency</InputLabel>
                          <Select
                            labelId="frequency-label"
                            id="frequency"
                            name="frequency"
                            value={frequency}
                            label="Frequency"
                            onChange={onFrequencyChange}
                          >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid container item xs={3} spacing={1}>
                        <Input
                          placeholder="Interval"
                          id="interval"
                          name="interval"
                          type="number"
                          inputProps={{ min: 1 }}
                          value={interval}
                          onChange={onIntervalChange}
                        />
                      </Grid>
                      {frequency === 'weekly' && (
                        <Grid container item xs={6} spacing={1}>
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                            (label, day) => (
                              <FormControlLabel
                                key={label}
                                control={
                                  <Checkbox
                                    checked={daysOfWeek.includes(day)}
                                    onChange={() => toggleDayOfWeek(day)}
                                  />
                                }
                                label={label}
                              />
                            )
                          )}
                        </Grid>
                      )}
                      {frequency === 'monthly' && (
                        <Grid container item xs={3} spacing={1}>
                          <Input
                            placeholder="Day of month"
                            id="dayOfMonth"
                            name="dayOfMonth"
                            type="number"
                            inputProps={{ min: 1, max: 31 }}
                            value={dayOfMonth}
                            onChange={onDayOfMonthChange}
                          />
                        </Grid>
                      )}
                      <Grid container item xs={3} spacing={1}>
                        <Input
                          placeholder="Timezone (e.g. -08:00)"
                          id="timezone"
                          name="timezone"
                          type="string"
                          value={timezone}
                          onChange={onChange}
                        />
                      </Grid>
                    </>
                  )}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    
  );
};

export default Create;
