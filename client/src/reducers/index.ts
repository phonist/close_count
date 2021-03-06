import { combineReducers } from 'redux';
import { AppState } from '../store';
import { authReducer } from './auth';
import { timerReducer } from './timer';
import { uiReducer } from './ui';

const appReducer = combineReducers({
  auth: authReducer,
  timer: timerReducer,
  UI: uiReducer
});

const rootReducer: any = (state: AppState, action: any) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;