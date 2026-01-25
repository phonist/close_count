import { push } from 'connected-react-router';
import type { AppDispatch } from '../../app/store';

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

export const dispatchError = (dispatch: AppDispatch) => (error: ApiError): never => {
  if (error.status === 401) {
    // connected-react-router's action type isn't compatible with RTK's UnknownAction
    dispatch(push('/login') as unknown as Parameters<AppDispatch>[0]);
  }

  throw error;
};
