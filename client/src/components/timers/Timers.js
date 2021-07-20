import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShowTimer from './ShowTimer';
import Create from './CreateTimer';
import { getTimers } from '../../actions/timer';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Timers = ({ getTimers, timer: { timers } }) => {
  const classes = useStyles();
  useEffect(() => {
    getTimers();
  }, [getTimers]);

  return (
    <Fragment>
      <h1 className="large text-primary">Timers</h1>
      <p className="lead">
        <i className="fas fa-clock" /> Timer List
      </p>
      <Create />
      <div className={classes.root}>
        <Grid container spacing={1}>
          {timers.map((timer) => (
            <Grid key={timer._id} item xs={4}>
              <ShowTimer className={classes.paper} timer={timer} />
            </Grid>
          ))}
        </Grid>
      </div>
    </Fragment>
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
