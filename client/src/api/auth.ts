import request from 'superagent';
import { handleSuccess, handleError } from '../utils/api';
const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const register = (params:any) =>
    request.post(`${apiURL}/users`)
        .send(params)
        .then(handleSuccess)
        .catch(handleError);
    
export const login = (params:any) =>
    request.post(`${apiURL}/auth`)
        .set('Access-Control-Allow-Origin','*')
        .send(params)
        .then(handleSuccess)
        .catch(handleError);

export const loadUser = (params:any) =>
    request.get(`${apiURL}/auth`)
        .set({ Authorization : localStorage.getItem('token') })
        .send(params)
        .then(handleSuccess)
        .catch(handleError);
        