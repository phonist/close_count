import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { connect } from 'react-redux';
import { destroy, startCountDown } from '../../actions/timer';

const Show = ({
  destroy,
  startCountDown,
  auth,
  timer: { _id, title, user, description, timer, status },
  showActions
}) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(timer) - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  // const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  // Clear timeout if the component is unmounted
  const timerComponents = Object.keys(timeLeft).map((interval) => {
      if (!timeLeft[interval]) {
          return 0;
      }

      return (
          <span key={interval}>
              {timeLeft[interval]} {interval}{" "}
          </span>
      );
  });

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <p className="my-1">{title}</p>
        <p className="my-1">{description}</p>
        <p className="post-date">Date: {formatDate(timer)}</p>
        {timerComponents.length ? timerComponents : <span> Times Up!</span>}
        {showActions && (
          <Fragment>
            {!auth.loading && user === auth.user._id && (
              <button
                onClick={() => destroy(_id)}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times" />
              </button>
            )}
            <button
              onClick={() => startCountDown(_id)}
              type="button"
              className="btn btn-success"
            >
              <i className="fas fa-times" />
            </button>
          </Fragment>
        )}
        
      </div>
    </div>
  );
}

Show.defaultProps = {
  showActions: true
};

Show.propTypes = {
  timer: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  destroy: PropTypes.func.isRequired,
  startCountDown: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { destroy, startCountDown })(Show);
