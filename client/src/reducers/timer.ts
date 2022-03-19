import {
    GET_TIMERS,
    CREATE_TIMER,
    STORE_TIMER,
    SHOW_TIMER,
    EDIT_TIMER,
    UPDATE_TIMER,
    DESTROY_TIMER,
    ERROR_TIMER
  } from '../actions/types';
  
  const initialState = {
    timers: [],
    loading: true,
    error: {}
  };
  
  function timerReducer(state = initialState, action) {
    const { type, payload } = action;
    
    switch (type) {
      case GET_TIMERS:
        return {
            ...state,
            timers: payload,
            loading: false
        };
      case CREATE_TIMER:
        return {
            ...state,
            timers: payload,
            loading: false
        };
      case STORE_TIMER:
        return {
            ...state,
            timers: [payload, ...state.timers],
            loading: false
        };
      case SHOW_TIMER:
        return {
            ...state,
            timers: payload,
            loading: false
        };
      case EDIT_TIMER:
        return {
            ...state,
            timers: payload,
            loading: false
        };
      case UPDATE_TIMER:
        return {
            ...state,
            timers: state.timers.map((timers) =>
                timers._id === payload.id ? { ...timers } : timers
            ),
            loading: false
        };
      case DESTROY_TIMER:
        return {
            ...state,
            timers: state.timers.filter((timers) => timers._id !== payload),
            loading: false
        };
      case ERROR_TIMER:
        return {
          ...state,
          error: payload,
          loading: false
        };
      default:
        return state;
    }
  }
  
  export default timerReducer;
  