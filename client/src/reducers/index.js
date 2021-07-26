import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import timer from './timer';

export default combineReducers({
  alert,
  auth,
  profile,
  timer
});
