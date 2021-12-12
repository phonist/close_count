import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShowTimer from './ShowTimer';
import Create from './CreateTimer';
import { getTimers } from '../../actions/timer';
import { Grid, Box, Container, Card } from '@mui/material';

const Timers = ({ 
  getTimers,
  timer: { timers }
}) => {

  useEffect(() => {
    getTimers();
  }, [getTimers]);

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
          {/* {Object.entries(timers).map(([key, timer]) => (
              <Grid item key={timer._id} xs={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <ShowTimer timer={timer} />
                </Card>
              </Grid>
          ))} */}
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
