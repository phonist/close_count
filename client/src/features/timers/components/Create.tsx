import { useState } from 'react';
import { attemptStoreTimer } from '../thunks';
//Material-UI
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
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
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const getTodayValue = () => new Date().toISOString().slice(0, 10);
const padTime = (value: number) => String(value).padStart(2, '0');

const Create = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timer: getTodayValue(),
    hour: 0,
    minute: 0,
    second: 0,
    isRecurring: false,
    frequency: 'daily' as RecurrenceFrequency,
    interval: 1,
    daysOfWeek: [] as number[],
    timezone: getLocalTimezoneOffset(),
  });

  const {
    title,
    description,
    timer,
    hour,
    minute,
    second,
    isRecurring,
    frequency,
    interval,
    daysOfWeek,
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

  const onTimeChange = (key: 'hour' | 'minute' | 'second') => (e: any) =>
    setFormData({ ...formData, [key]: Number(e.target.value) });

  const now = new Date();
  const isToday = timer === getTodayValue();
  const currentTotalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const selectedTotalSeconds = hour * 3600 + minute * 60 + second;
  const isPastSelection = isToday && selectedTotalSeconds < currentTotalSeconds;

  const buildIsoDateTime = () => {
    const dateValue = timer || getTodayValue();
    const timeValue = `${padTime(hour)}:${padTime(minute)}:${padTime(second)}`;
    const localDate = new Date(`${dateValue}T${timeValue}`);
    return Number.isNaN(localDate.getTime()) ? new Date().toISOString() : localDate.toISOString();
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isPastSelection) {
      return;
    }
    const timerIso = buildIsoDateTime();
    const recurrence = isRecurring
      ? {
          frequency,
          interval: Number(interval) || 1,
          ...(frequency === 'weekly' ? { daysOfWeek } : {}),
          ...(frequency === 'monthly' ? {} : {}),
        }
      : undefined;
    const payload = {
      title,
      description,
      timer: timerIso,
      isRecurring,
      recurrence,
      timezone: isRecurring ? timezone : undefined,
    };
    dispatch(attemptStoreTimer(payload));
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid rgba(148, 163, 184, 0.4)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Create timer
            </Typography>
            <Typography variant="caption" color="text.secondary">
              One-off or recurring reminders.
            </Typography>
          </Box>
          <FormControlLabel
            control={<Switch checked={isRecurring} onChange={onToggleRecurring} />}
            label="Recurring"
            sx={{ ml: 0 }}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                id="timer"
                type="date"
                name="timer"
                value={timer}
                onChange={onChange}
                inputProps={{ min: getTodayValue() }}
                size="small"
                InputLabelProps={{ shrink: true }}
                error={isPastSelection}
                helperText={isPastSelection ? 'Select a future time.' : ' '}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="HH"
                id="hour"
                name="hour"
                type="number"
                inputProps={{ min: 0, max: 23 }}
                value={hour}
                onChange={onTimeChange('hour')}
                size="small"
                error={isPastSelection}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="MM"
                id="minute"
                name="minute"
                type="number"
                inputProps={{ min: 0, max: 59 }}
                value={minute}
                onChange={onTimeChange('minute')}
                size="small"
                error={isPastSelection}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="SS"
                id="second"
                name="second"
                type="number"
                inputProps={{ min: 0, max: 59 }}
                value={second}
                onChange={onTimeChange('second')}
                size="small"
                error={isPastSelection}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ textTransform: 'none' }}
                disabled={isPastSelection}
              >
                Add Timer
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: isRecurring ? 'block' : 'none',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Interval"
                      id="interval"
                      name="interval"
                      type="number"
                      inputProps={{ min: 1 }}
                      value={interval}
                      onChange={onIntervalChange}
                      size="small"
                    />
                  </Grid>
                  {frequency === 'weekly' && (
                    <Grid item xs={12}>
                      <ToggleButtonGroup
                        value={daysOfWeek}
                        onChange={(_, value) => setFormData({ ...formData, daysOfWeek: value })}
                        aria-label="days of week"
                        size="small"
                      >
                        {DAYS.map((label, day) => (
                          <ToggleButton
                            key={label}
                            value={day}
                            aria-label={label}
                            sx={{ textTransform: 'none' }}
                          >
                            {label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Timezone (e.g. -08:00)"
                      id="timezone"
                      name="timezone"
                      value={timezone}
                      onChange={onChange}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Create;
