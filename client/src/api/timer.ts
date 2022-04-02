import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';

const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getTimers = (params:any) => 
    request.get(`${apiURL}/timers/${params}`)
        .set({ Authorization : localStorage.getItem('token') })
        .then(handleSuccess)
        .catch(handleError);

export const create = (params:any) =>
    request.get(`${apiURL}/timers/create`)
        .then(handleSuccess)
        .catch(handleError);

export const store = (params:any) =>
    request.post(`${apiURL}/timers`)
        .set({ Authorization : localStorage.getItem('token') })
        .send(params)
        .then(handleSuccess)
        .catch(handleError);

export const show = (params:any) =>
    request.get(`${apiURL}/timers/${params.id}`)
        .then(handleSuccess)
        .catch(handleError);

export const edit = (params:any) =>
    request.get(`${apiURL}/timers/${params.id}/edit`)
        .then(handleSuccess)
        .catch(handleError);

export const update = (params:any) =>
    request.put(`${apiURL}/timers/${params.id}`)
        .send(params)
        .then(handleSuccess)
        .catch(handleError);

export const destroy = (params:any) =>
    request.delete(`${apiURL}/timers/${params}`)
        .set({ Authorization : localStorage.getItem('token') })
        .then(handleSuccess)
        .catch(handleError);