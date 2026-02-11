import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Show from './Show';
import Create from './Create';
import { attemptGetTimers } from '../thunks';
import { Grid, Box, Container, Card, Typography, Stack, Chip, Divider } from '@mui/material';
import Error from '../../../shared/components/common/Error';
import Loading from '../../../shared/components/common/Loading';
import Toolbar from '@mui/material/Toolbar';
import { Timer } from '../types';

const Timers = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.timer);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.credentials._id) {
      dispatch(attemptGetTimers());
    }
  }, [auth.credentials._id, dispatch]);

  const totalTimers = data.timers.length;
  const recurringTimers = data.timers.filter((timer: Timer) => timer.isRecurring).length;
  const nextRunAtLabel = (() => {
    const candidates = data.timers
      .map((timer: Timer) => timer.nextRunAt ?? timer.timer)
      .map((value) => new Date(value))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (candidates.length === 0) {
      return '—';
    }

    return candidates[0].toLocaleDateString();
  })();

  return (
    <Box
      component="main"
      sx={{
        background:
          'radial-gradient(1200px 500px at 10% 0%, #e0f2fe 0%, transparent 60%), radial-gradient(900px 400px at 90% 10%, #f1f5f9 0%, transparent 55%), #f8fafc',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Box component="style">{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
      `}</Box>
      <Toolbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: '-0.02em',
                fontWeight: 700,
              }}
            >
              Close Count
            </Typography>
            <Typography
              sx={{
                mt: 1,
                color: 'text.secondary',
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              Timers that stay on schedule. Add a quick countdown or create a recurring plan.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: { xs: 1, md: 0 } }}>
            <Chip label={`Total: ${totalTimers}`} />
            <Chip label={`Recurring: ${recurringTimers}`} />
            <Chip label={`Next run: ${nextRunAtLabel}`} />
          </Stack>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
              <Create />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {!data.loading &&
                data.timers.map((timer: Timer) => (
                  <Grid item key={String(timer._id)} xs={12} sm={6}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <Show timer={timer} />
                    </Card>
                  </Grid>
                ))}
              {data.loading && (
                <Grid item xs={12}>
                  <Loading />
                </Grid>
              )}
              {data.error !== '' && (
                <Grid item xs={12}>
                  <Error />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Timers;
