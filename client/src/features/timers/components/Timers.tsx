import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Show from './Show';
import Create from './Create';
import { attemptGetTimers } from '../thunks';
import { Grid, Box, Container, Card } from '@mui/material';
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

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={4}>
            <Toolbar />
          
            <Create />
          
            {!data.loading && data.timers.map((timer: Timer) => (
                <Grid item key={String(timer._id)} xs={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Show timer={timer} />
                  </Card>
                </Grid>
            ))}
            {data.loading && <Loading />}
            {data.error !== '' && <Error />}
          </Grid>
      </Container>
      
    </Box>
  );
};

export default Timers;
