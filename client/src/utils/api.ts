import { push } from 'connected-react-router';
import { Dispatch } from 'redux';

interface ApiResponse {
  body: unknown;
  status?: number;
}

interface ApiError {
  response?: ApiResponse;
  status?: number;
  body?: { message?: string };
  message?: string;
}

export const handleSuccess = <T>(response: ApiResponse): T => response.body as T;

export const handleError = (error: ApiError): never => {
  if (error.response) {
    throw error.response;
  } else {
    const response: ApiResponse = { 
      status: 500, 
      body: { message: 'Internal Server error' } 
    };
    throw response;
  }
};

export const dispatchError = (dispatch: Dispatch) => (error: ApiError): never => {
  if (error.status === 401) {
    dispatch(push('/login'));
  }

  throw error;
};
