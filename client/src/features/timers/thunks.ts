import { getTimers, store, update, destroy, show, advance } from './api';
import { addTimer, removeTimer, setTimerError, setTimerLoading, setTimers, updateTimer } from './timersSlice';
import type { AppDispatch } from '../../app/store';

export const attemptGetTimers = () => async (dispatch: AppDispatch) => {
  dispatch(setTimerLoading(true));
  await getTimers()
    .then((response) => {
      dispatch(setTimers(response));
    })
    .catch((error) => {
      dispatch(setTimerError(error));
    });
};

export const attemptGetTimer = (id: string) => async (dispatch: AppDispatch) => {
  await show({ id })
    .then((response) => {
      dispatch(updateTimer(response));
    })
    .catch((error) => {
      dispatch(setTimerError(error));
    });
};

export const attemptAdvanceTimer = (id: string) => async (dispatch: AppDispatch) => {
  await advance({ id })
    .then((response) => {
      dispatch(updateTimer(response));
    })
    .catch((error) => {
      dispatch(setTimerError(error));
    });
};

export const attemptStoreTimer = (params: {
  title: string;
  description: string;
  timer: string;
  isRecurring?: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval?: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };
  timezone?: string;
}) => async (dispatch: AppDispatch) => {
  await store(params)
    .then((response) => {
      dispatch(addTimer(response));
    })
    .catch((error) => {
      dispatch(setTimerError(error));
    });
};

export const attemptUpdateTimer = (params: { id: string; [key: string]: unknown }) => async (dispatch: AppDispatch) => {
  await update(params)
    .then((response) => {
      dispatch(updateTimer(response));
    })
    .catch((error) => {
      dispatch(setTimerError(error));
    });
};

export const attemptDestroyTimer = (params: string) => async (dispatch: AppDispatch) => {
  await destroy(params)
    .then(() => {
      dispatch(removeTimer(params));
    })
    .catch((error) => {
      dispatch(setTimerError(error));
    });
};
