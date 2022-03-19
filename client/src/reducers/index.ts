import { combineReducers } from 'redux';
import alert from './alert';
import { authReducer } from './auth';
import { timerReducer } from './timer';

const appReducer = combineReducers({
  alert,
  auth: authReducer,
  timer: timerReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;