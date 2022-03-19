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
    CreateTimerTypes,
    StoreTimerTypes,
    ShowTimerTypes,
    EditTimerTypes,
    UpdateTimerTypes,
    DestroyTimerTypes,
    ErrorTimerTypes
} from '../types/TimerTypes';

import { Timer } from "../interfaces/Timer";

export const timers = (timer: Timer) : GetTimersTypes => ({
    type: GET_TIMERS,
    payload: timer,
});

export const createTimer = (timer: Timer) : CreateTimerTypes => ({
    type: CREATE_TIMER,
    payload: timer,
});

export const storeTimer = (timer: Timer) : StoreTimerTypes => ({
    type: STORE_TIMER,
    payload: timer,
});

export const showTimer = (timer: Timer) : ShowTimerTypes => ({
    type: SHOW_TIMER,
    payload: timer,
});

export const editTimer = (timer: Timer) : EditTimerTypes => ({
    type: EDIT_TIMER,
    payload: timer,
});

export const updateTimer = (timer: Timer) : UpdateTimerTypes => ({
    type: UPDATE_TIMER,
    payload: timer,
});

export const destroyTimer = (timer: Timer) : DestroyTimerTypes => ({
    type: DESTROY_TIMER,
    payload: timer,
});

export const errorTimer = (timer: Timer) : ErrorTimerTypes => ({
    type: ERROR_TIMER,
    payload: timer,
});
