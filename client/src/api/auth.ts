import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';
import { Auth } from '../interfaces/Auth';

export interface AuthTokenResponse {
  token: string;
}

const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:8005/api';

// Helper function to get auth token with Bearer prefix
const getAuthHeader = (): string => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

export const register = (params: { name: string; email: string; password: string }): Promise<AuthTokenResponse> =>
    request.post(`${apiURL}/users`)
        .send(params)
        .then(handleSuccess<AuthTokenResponse>)
        .catch(handleError);
    
export const login = (params: { email: string; password: string }): Promise<AuthTokenResponse> =>
    request.post(`${apiURL}/auth`)
        .send(params)
        .then(handleSuccess<AuthTokenResponse>)
        .catch(handleError);

export const loadUser = (): Promise<Auth> =>
    request.get(`${apiURL}/auth`)
        .set({ Authorization: getAuthHeader() })
        .then(handleSuccess<Auth>)
        .catch(handleError);
        
