import {
  GET_TIMERS,
  CREATE_TIMER,
  STORE_TIMER,
  SHOW_TIMER,
  EDIT_TIMER,
  UPDATE_TIMER,
  DESTROY_TIMER,
  ERROR_TIMER,
  GetTimersStateType,
  GetTimersType,
  CreateTimerType,
  StoreTimerType,
  ShowTimerType,
  EditTimerType,
  UpdateTimerType,
  DestroyTimerType,
  ErrorTimerType,
} from '../types/TimerTypes';
  
const initialState: GetTimersStateType = {
  timers: {
    _id: '',
    description: '',
    status: '',
    timer: '',
    title: '',
    user: '',
  },
  authenticated: true,
  loading: true,
  error: '',
};
// function timerReducer(state = initialState, action) {

export const timerReducer = (
  state = initialState, 
  action: GetTimersType | CreateTimerType | StoreTimerType | ShowTimerType | EditTimerType | UpdateTimerType | DestroyTimerType | ErrorTimerType,
) : GetTimersStateType => {
  switch (action.type) {
    case GET_TIMERS:
      return {
          ...state,
          timers: action.payload,
          loading: false
      };
    case CREATE_TIMER:
      return {
          ...state,
          timers: action.payload,
          loading: false
      };
    case STORE_TIMER:
      return {
          ...state,
          timers: action.payload, ...state.timers,
          loading: false
      };
    case SHOW_TIMER:
      return {
          ...state,
          timers: action.payload,
          loading: false
      };
    case EDIT_TIMER:
      return {
          ...state,
          timers: action.payload,
          loading: false
      };
    case UPDATE_TIMER:
      return {
          ...state,
          timers: action.payload, ...state.timers,
          loading: false
      };
    case DESTROY_TIMER:
      return {
          ...state,
          timers: action.payload, ...state.timers,
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
