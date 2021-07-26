import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShowTimer from './ShowTimer';
import Create from './CreateTimer';
import { getTimers } from '../../actions/timer';
//Material-UI
import H1 from '@material-tailwind/react/Heading1';
import Paragraph from "@material-tailwind/react/Paragraph";
import Card from '@material-tailwind/react/Card';
import CardBody from '@material-tailwind/react/CardBody';

const Timers = ({ 
  getTimers, 
  timer: { timers }
}) => {
  useEffect(() => {
    getTimers();
  }, [getTimers]);

  return (
    <section className="relative py-16 bg-gray-100">
      <H1 color="lightBlue">Timers</H1>
      <Paragraph color="lightBlue">
        <i className="fas fa-clock" /> Timer List
      </Paragraph>
      <Create />
      <Card>
        {timers.map((timer) => (
            <CardBody key={timer._id}>
              <ShowTimer timer={timer} />
            </CardBody>
        ))}
      </Card>
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
