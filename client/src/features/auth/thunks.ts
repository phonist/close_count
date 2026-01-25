import { login, register, loadUser } from './api';
import { setAuthenticated, setLoadingUser, setUnauthenticated, setUser } from './authSlice';
import { setLoading } from '../../app/uiSlice';
import type { AppDispatch } from '../../app/store';

export const attemptLogin = (params: { email: string; password: string }) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  await login(params)
    .then((response) => {
      localStorage.setItem('token', `${response.token}`);
      dispatch(attemptLoadUser());
      dispatch(setLoadingUser());
    })
    .catch((error) => error);
};

export const attemptLogout = () => async (dispatch: AppDispatch) => {
  localStorage.removeItem('token');
  dispatch(setUnauthenticated());
  window.location.href = '/login';
};

export const attemptRegister = (params: { name: string; email: string; password: string }) => async (dispatch: AppDispatch) => {
  const auth = await register(params)
    .then((response) => {
      localStorage.setItem('token', `${response.token}`);
      dispatch(attemptLoadUser());
      return response;
    })
    .catch((error) => {
      dispatch(setUnauthenticated());
      return error;
    });

  if (auth && typeof auth === 'object' && 'token' in auth) {
    dispatch(setAuthenticated());
  }
  return auth;
};

export const attemptLoadUser = () => async (dispatch: AppDispatch) => {
  dispatch(setLoadingUser());

  await loadUser()
    .then((response) => {
      dispatch(setUser(response));
    })
    .catch((error) => error);
};
