import { push } from 'connected-react-router';

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