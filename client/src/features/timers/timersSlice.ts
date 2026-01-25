import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Timer } from './types';

interface TimersState {
  timers: Timer[];
  authenticated: boolean;
  loading: boolean;
  error: string;
}

const initialState: TimersState = {
  timers: [],
  authenticated: true,
  loading: true,
  error: '',
};

const timersSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setTimers: (state, action: PayloadAction<Timer[]>) => {
      state.timers = action.payload;
      state.loading = false;
    },
    addTimer: (state, action: PayloadAction<Timer>) => {
      state.timers.unshift(action.payload);
      state.loading = false;
    },
    updateTimer: (state, action: PayloadAction<Timer>) => {
      state.timers = state.timers.map((timer) =>
        timer._id === action.payload._id ? action.payload : timer
      );
      state.loading = false;
    },
    removeTimer: (state, action: PayloadAction<string>) => {
      state.timers = state.timers.filter((timer) => timer._id !== action.payload);
      state.loading = false;
    },
    setTimerError: (state, action: PayloadAction<unknown>) => {
      state.error = JSON.stringify(action.payload);
      state.loading = false;
    },
    setTimerLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTimers, addTimer, updateTimer, removeTimer, setTimerError, setTimerLoading } = timersSlice.actions;
export default timersSlice.reducer;
