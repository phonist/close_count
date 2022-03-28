import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';
import { push } from 'connected-react-router';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:8005/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
**/

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  }
);

export default api;

// import { logout } from '_actions/user';

export const handleSuccess = (response:any) => response.body;

export const handleError = (error:any) => {
  if (error.response) {
    throw error.response;
  } else {
    const response = { status: 500, body: { message: 'Internal Server error' } };
    throw response;
  }
};

export const dispatchError = (dispatch:any) => (error:any) => {
  if (error.status === 401) {
    // dispatch(logout());
    dispatch(push('/login'));
  }

  throw error;
};