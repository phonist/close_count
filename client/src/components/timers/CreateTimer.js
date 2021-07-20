import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { store } from '../../actions/timer';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container:{
    display: 'flex',
    flexWrap: 'wrap',
  }
}));

const Create = ({ store }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timer: ''
  });

  const {title , description, timer } = formData;

  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className={classes.root}>
      <div className='bg-primary p'>
        <h3>Set Timer</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          store( formData );
        }}
      >
        <Grid container className={classes.container} spacing={1}>
            <Grid container item xs={3} spacing={1}>
              <TextField
                variant="outlined"
                id="title"
                label="Title"
                type="string"
                name="title"
                value={title}
                onChange={onChange}
              />
            </Grid>
            <Grid container item xs={3} spacing={1}>
              <TextField
                variant="outlined"
                id="description"
                label="Description"
                type="string"
                name="description"
                value={description}
                onChange={onChange}
              />
            </Grid>
            <Grid container item xs={3} spacing={1}>
              <TextField
                variant="outlined"
                id="timer"
                label="Count Down Date"
                type="date"
                name="timer"
                value={timer}
                onChange={onChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid container item xs={3} spacing={1}>
              <input type='submit' className='btn btn-dark my-1' value='Add' />
            </Grid>
        </Grid>
      </form>
    </div>
  );
};

Create.propTypes = {
  store: PropTypes.func.isRequired
};

export default connect(
  null,
  { store }
)(Create);
