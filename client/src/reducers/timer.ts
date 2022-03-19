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
  GetTimersTypes,
  CreateTimerType,
  StoreTimerType,
  ShowTimerType,
  EditTimerType,
  UpdateTimerType,
  DestroyTimerType,
  ErrorTimerType,
} from '../types/TimerTypes';
  
const initialState: GetTimersStateType = {
  isAuthenticated: null,
  loading: true,
  timers: {
    _id: '',
    description: '',
    status: '',
    timer: '',
    title: '',
    user: '',
  }
};
// function timerReducer(state = initialState, action) {

export const timerReducer = (
  state = initialState, 
  action: GetTimersTypes | CreateTimerType | StoreTimerType | ShowTimerType | EditTimerType | UpdateTimerType | DestroyTimerType | ErrorTimerType,
) : GetTimersStateType => {
  switch (action.type) {
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
