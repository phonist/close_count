import { 
    GET_TIMERS,
    STORE_TIMER,
    UPDATE_TIMER,
    DESTROY_TIMER,
    ERROR_TIMER,
    GetTimersType, 
    StoreTimerType,
    UpdateTimerType,
    DestroyTimerType,
    ErrorTimerType
} from '../types/TimerTypes';

import { Timer } from "../interfaces/Timer";

export const timers = (timer: Timer[]) : GetTimersType => ({
    type: GET_TIMERS,
    payload: timer,
});

export const storeTimer = (timer: Timer) : StoreTimerType => ({
    type: STORE_TIMER,
    payload: timer,
});

export const updateTimer = (timer: Timer) : UpdateTimerType => ({
    type: UPDATE_TIMER,
    payload: timer,
});

export const destroyTimer = (id: string) : DestroyTimerType => ({
    type: DESTROY_TIMER,
    payload: id,
});

export const errorTimer = (timer: Timer) : ErrorTimerType => ({
    type: ERROR_TIMER,
    payload: timer,
});
