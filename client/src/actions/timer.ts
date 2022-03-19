import { 
    GET_TIMERS,
    CREATE_TIMER,
    STORE_TIMER,
    SHOW_TIMER,
    EDIT_TIMER,
    UPDATE_TIMER,
    DESTROY_TIMER,
    ERROR_TIMER,
    GetTimersTypes, 
    CreateTimerType,
    StoreTimerType,
    ShowTimerType,
    EditTimerType,
    UpdateTimerType,
    DestroyTimerType,
    ErrorTimerType
} from '../types/TimerTypes';

import { Timer } from "../interfaces/Timer";

export const timers = (timer: Timer) : GetTimersTypes => ({
    type: GET_TIMERS,
    payload: timer,
});

export const createTimer = (timer: Timer) : CreateTimerType => ({
    type: CREATE_TIMER,
    payload: timer,
});

export const storeTimer = (timer: Timer) : StoreTimerType => ({
    type: STORE_TIMER,
    payload: timer,
});

export const showTimer = (timer: Timer) : ShowTimerType => ({
    type: SHOW_TIMER,
    payload: timer,
});

export const editTimer = (timer: Timer) : EditTimerType => ({
    type: EDIT_TIMER,
    payload: timer,
});

export const updateTimer = (timer: Timer) : UpdateTimerType => ({
    type: UPDATE_TIMER,
    payload: timer,
});

export const destroyTimer = (timer: Timer) : DestroyTimerType => ({
    type: DESTROY_TIMER,
    payload: timer,
});

export const errorTimer = (timer: Timer) : ErrorTimerType => ({
    type: ERROR_TIMER,
    payload: timer,
});
