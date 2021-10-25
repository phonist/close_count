import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { store } from '../../actions/timer';
//Material-UI
import { Grid, Card, CardContent, Typography, Input, Button } from '@mui/material';

const Create = ({ store }) => {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timer: ''
  });

  const {title , description, timer } = formData;

  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={10}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
            Set Timer
            </Typography>
            <form
              className='form my-1'
              onSubmit={e => {
                e.preventDefault();
                store( formData );
              }}
            >
              <Grid container spacing={1}>
                  <Grid container item xs={3} spacing={1}>
                    <Input
                      placeholder='Title'
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
                    <Input
                      placeholder='Description'
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
                    <Input
                      placeholder='Timer'
                      variant="outlined"
                      id="timer"
                      label="Count Down Date"
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
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    
  );
};

Create.propTypes = {
  store: PropTypes.func.isRequired
};

export default connect(
  null,
  { store }
)(Create);
