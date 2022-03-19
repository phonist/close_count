import React, { useState } from 'react';
import { store } from '../../actions/timer';
//Material-UI
import { Grid, Card, CardContent, Typography, Input, Button, Box } from '@mui/material';

const Create = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timer: ''
  });

  const {title , description, timer } = formData;

  const onChange = (e: any) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let formData = { title, description, timer }
    store(formData);
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={10}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom component="div">
            Set Timer
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={1}>
                  <Grid container item xs={3} spacing={1}>
                    <Input
                      placeholder='Title'
                      id="title"
                      type="string"
                      name="title"
                      value={title}
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid container item xs={3} spacing={1}>
                    <Input
                      placeholder='Description'
                      id="description"
                      type="string"
                      name="description"
                      value={description}
                      onChange={onChange}
                    />
                  </Grid>
                  <Grid container item xs={3} spacing={1}>
                    <Input
                      placeholder='Timer'
                      id="timer"
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
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    
  );
};

export default Create;
