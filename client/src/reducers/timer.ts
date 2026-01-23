import {
  GET_TIMERS,
  STORE_TIMER,
  UPDATE_TIMER,
  DESTROY_TIMER,
  ERROR_TIMER,
  GetTimersStateType,
  GetTimersType,
  StoreTimerType,
  UpdateTimerType,
  DestroyTimerType,
  ErrorTimerType,
} from '../types/TimerTypes';
  
const initialState: GetTimersStateType = {
  timers: [],
  authenticated: true,
  loading: true,
  error: '',
};
// function timerReducer(state = initialState, action) {

export const timerReducer = (
  state = initialState, 
  action: GetTimersType | StoreTimerType | UpdateTimerType | DestroyTimerType | ErrorTimerType,
) : GetTimersStateType => {
  switch (action.type) {
    case GET_TIMERS:
      return {
          ...state,
          timers: action.payload,
          loading: false
      };
    case STORE_TIMER:
      return {
          ...state,
          timers: [action.payload, ...state.timers],
          loading: false
      };
    case UPDATE_TIMER:
      return {
          ...state,
          timers: state.timers.map((timer) =>
            timer._id === action.payload._id ? action.payload : timer
          ),
          loading: false
      };
    case DESTROY_TIMER:
      return {
          ...state,
          timers: state.timers.filter((timer) => timer._id !== action.payload),
          loading: false
      };
    case ERROR_TIMER:
      return {
        ...state,
        error: JSON.stringify(action.payload),
        loading: false
      };
    default:
      return state;
  }
}
