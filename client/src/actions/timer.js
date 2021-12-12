import api from '../utils/api';
import { setAlert } from './alert';

import {
    GET_TIMERS,
    CREATE_TIMER,
    STORE_TIMER,
    SHOW_TIMER,
    EDIT_TIMER,
    UPDATE_TIMER,
    DESTROY_TIMER,
    ERROR_TIMER
} from './types';

// Get timers
export const getTimers = () => async dispatch => {
    console.log('getTimers');
    try {
        const res = await api.get('/timers');
        console.log('res', res.data);
        dispatch({
            type: GET_TIMERS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ERROR_TIMER,
            payload: err
        });
    }
};
  
// Create timer
export const create = () => async dispatch => {
    try{
        const res = await api.get('/timers/create');
        dispatch({
            type: CREATE_TIMER,
            payload: res.data
        });
    }catch (err) {
        dispatch({
            type: ERROR_TIMER,
            payload: err
        });
    }
}

// Store timer
export const store = formData => async dispatch => {
    try{
        const res = await api.post('/timers',formData);
        dispatch({
            type: STORE_TIMER,
            payload: res.data
        });

        dispatch(setAlert('Timer Created', 'success'));
    }catch (err) {
        dispatch({
            type: ERROR_TIMER,
            payload: err
        });
    }
}

// Show timer
export const show = id => async dispatch => {
    try {
        const res = await api.get(`/timers/${id}`);
        dispatch({
        type: SHOW_TIMER,
        payload: res.data
        });
    } catch (err) {
        dispatch({
        type: ERROR_TIMER,
        payload: err
        });
    }
};

// Edit timer
export const edit = id => async dispatch => {
    try{
        const res = await api.post(`/timers/${id}/edit`);
        dispatch({
            type: EDIT_TIMER,
            payload: res.data
        });
    }catch (err) {
        dispatch({
            type: ERROR_TIMER,
            payload: err
        });
    }
}

// Update timer
export const update = id => async dispatch => {
    try {
        const res = await api.put(`/timers/${id}`);

        dispatch({
            type: UPDATE_TIMER,
            payload: { id, likes: res.data }
        });
        dispatch(setAlert('Timer Updated', 'success'));
    } catch (err) {
        dispatch({
            type: ERROR_TIMER,
            payload: err
        });
    }
};
  
// Destroy timer
export const destroy = id => async dispatch => {
    try {
        await api.delete(`/timers/${id}`);
        dispatch({
            type: DESTROY_TIMER,
            payload: id
        });
    } catch (err) {
        dispatch({
            type: ERROR_TIMER,
            payload: err
        });
    }
};

//start count down
export const startCountDown = id => async dispatch => {
    
    try {
        await api.put(`/timers/${id}`);
        dispatch({
            type: UPDATE_TIMER,
            payload: id
        });
        dispatch(setAlert('Timer Activated', 'success'));
    } catch (err) {
        dispatch({
            type: ERROR_TIMER,
            payload: err
        });
    }
}
  