import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import ShowTimer from './ShowTimer';
import Create from './CreateTimer';
import { getTimers } from '../../actions/timer';
import { Grid, Box, Container, Card } from '@mui/material';
import Error from '../common/Error';
import Loading from '../common/Loading';
import Empty from '../common/Empty';

const Timers = ({ 
  getTimers,
  timer: { timers }
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);

  const data = useSelector((state) => state.timer);

  useEffect(() => {
    if(data.error.length > 1) {
      setError(true);
    }else{
      setError(false);
    }
    if(data.loading && !data.timers) {
      setLoading(true);
    }else{
      setLoading(false);
    }
    if(data.timers.length === 0) {
      getTimers();
      setEmpty(true);
    }else{
      setEmpty(false);
    }
  }, [data, getTimers]);

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
          {!loading && Object.entries(timers).map(([key, timer]) => (
              <Grid item key={timer._id} xs={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <ShowTimer timer={timer} />
                </Card>
              </Grid>
          ))}
          {loading && <Loading />}
          {error && <Error />}
          {empty && <Empty />}
        </Grid>
      </Container>
    </main>
  );
};

Timers.propTypes = {
  getTimers: PropTypes.func.isRequired,
  timer: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  timer: state.timer
});

export default connect(mapStateToProps, { getTimers })(Timers);
