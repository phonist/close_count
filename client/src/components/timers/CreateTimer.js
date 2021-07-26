import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { store } from '../../actions/timer';
import Grid from '@material-ui/core/Grid';
//Material-UI
import H6 from '@material-tailwind/react/Heading6';
import Card from "@material-tailwind/react/Card";
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from "@material-tailwind/react/CardBody";
import Input from '@material-tailwind/react/Input';
import Button from '@material-tailwind/react/Button';

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
    <Card>
      <CardHeader>
        <H6>Set Timer</H6>
      </CardHeader>
      <CardBody>
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
              <Grid container item xs={3} spacing={1}>
                <Button 
                  type="submit"
                  color="lightBlue"
                  buttonType="filled"
                  size="regular"
                  rounded={false}
                  block={false}
                  iconOnly={false}
                  ripple="light">
                  Add Timer
                </Button>
              </Grid>
          </Grid>
        </form>
      </CardBody>
    </Card>
  );
};

Create.propTypes = {
  store: PropTypes.func.isRequired
};

export default connect(
  null,
  { store }
)(Create);
