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
        .send(params)
        .then(handleSuccess)
        .catch(handleError);

export const loadUser = () =>
    request.get(`${apiURL}/auth`)
        .then(handleSuccess)
        .catch(handleError);
        