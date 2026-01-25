import { getTimers, store, update, destroy } from './api';
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

export const attemptStoreTimer = (params: { title: string; description: string; timer: string }) => async (dispatch: AppDispatch) => {
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
