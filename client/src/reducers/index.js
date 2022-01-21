import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import timer from './timer';

const appReducer = combineReducers({
  alert,
  auth,
  timer
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;