import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';
import { Timer } from '../redux/interfaces/Timer';

const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:8005/api';

// Helper function to get auth token with Bearer prefix
const getAuthHeader = (): string => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

export const getTimers = (): Promise<Timer[]> =>
    request.get(`${apiURL}/timers`)
        .set({ Authorization: getAuthHeader() })
        .then(handleSuccess<Timer[]>)
        .catch(handleError);

export const store = (params: { title: string; description: string; timer: string }): Promise<Timer> =>
    request.post(`${apiURL}/timers`)
        .set({ Authorization: getAuthHeader() })
        .send(params)
        .then(handleSuccess<Timer>)
        .catch(handleError);

export const show = (params: { id: string }): Promise<Timer> =>
    request.get(`${apiURL}/timers/${params.id}`)
        .set({ Authorization: getAuthHeader() })
        .then(handleSuccess<Timer>)
        .catch(handleError);

export const update = (params: { id: string; [key: string]: unknown }): Promise<Timer> =>
    request.put(`${apiURL}/timers/${params.id}`)
        .set({ Authorization: getAuthHeader() })
        .send(params)
        .then(handleSuccess<Timer>)
        .catch(handleError);

export const destroy = (params: string): Promise<{ msg: string }> =>
    request.delete(`${apiURL}/timers/${params}`)
        .set({ Authorization: getAuthHeader() })
        .then(handleSuccess<{ msg: string }>)
        .catch(handleError);
