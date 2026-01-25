import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import timerReducer from '../../features/timers/timersSlice';
import uiReducer from '../uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    timer: timerReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
