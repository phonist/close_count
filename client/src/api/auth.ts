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
        .set('Origin','https://close-count.vercel.app/')
        .set('Access-Control-Request-Method','POST')
        .set('Access-Control-Request-Headers','X-PINGOTHER, Content-Type')
        .send(params)
        .then(handleSuccess)
        .catch(handleError);

export const loadUser = (params:any) =>
    request.get(`${apiURL}/auth`)
        .set({ Authorization : localStorage.getItem('token') })
        .send(params)
        .then(handleSuccess)
        .catch(handleError);
        