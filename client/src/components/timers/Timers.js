import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShowTimer from './ShowTimer';
import Create from './CreateTimer';
import { getTimers } from '../../actions/timer';
//Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const Timers = ({ 
  getTimers, 
  timer: { timers }
}) => {
  const classes = useStyles();
  
  useEffect(() => {
    getTimers();
  }, [getTimers]);

  return (
    <section className="relative py-16 bg-gray-100">
      <Create />
      <div className={classes.control}></div>
      
      <Grid container justifyContent="center" className={classes.root} spacing={2}>
        <Grid item xs={10}>
          <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
            {timers.map((timer) => (
                <Grid key={timer._id} item xs={4} spacing={2}>
                  <Paper elevation={2}>
                    <ShowTimer timer={timer} />
                  </Paper>
                </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </section>
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
