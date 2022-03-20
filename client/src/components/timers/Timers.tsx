import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Show from './Show';
import Create from './Create';
import { attemptGetTimers } from '../../thunks/timer';
import { Grid, Box, Container, Card } from '@mui/material';
import Error from '../common/Error';
import Loading from '../common/Loading';
import { AppState } from '../../store';

// const Timers = ({ 
//   getTimers,
//   timer: { timers }
// }) => {
const Timers = () => {
  const data = useSelector((state:AppState) => state.timer);
  const user = useSelector((state:AppState) => state.auth.auth);

  useEffect(() => {
    attemptGetTimers(user);
  }, [user]);

  return (
    <main>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Create />
        </Container>
      </Box>
      {/* Hero unit */}
      <Container sx={{ py: 8 }} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {!data.loading && Object.entries(data.timers).map(([key, timer]) => (
              <Grid item key={key} xs={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Show timer={timer} />
                </Card>
              </Grid>
          ))}
          {data.loading && <Loading />}
          {!data.error && <Error />}
        </Grid>
      </Container>
    </main>
  );
};

export default Timers;
