import { Timer } from '../redux/interfaces/Timer';

export const GET_TIMERS = 'GET_TIMERS';
export const STORE_TIMER = 'STORE_TIMER';
export const UPDATE_TIMER = 'UPDATE_TIMER';
export const DESTROY_TIMER = 'DESTROY_TIMER';
export const ERROR_TIMER = 'ERROR_TIMER';

export interface GetTimersStateType {
    timers: Timer[];
    authenticated: Boolean;
    loading: Boolean;
    error: String;
}

interface GetTimersActionType {
    type: typeof GET_TIMERS;
    payload: Timer[];
}
export type GetTimersType = GetTimersActionType;

interface StoreTimerActionType {
    type: typeof STORE_TIMER;
    payload: Timer;
}
export type StoreTimerType = StoreTimerActionType;

interface UpdateTimerActionType {
    type: typeof UPDATE_TIMER;
    payload: Timer;
}
export type UpdateTimerType = UpdateTimerActionType;

interface DestroyTimerActionType {
    type: typeof DESTROY_TIMER;
    payload: string;
}
export type DestroyTimerType = DestroyTimerActionType;

interface ErrorTimerActionType {
    type: typeof ERROR_TIMER;
    payload: Timer;
}
export type ErrorTimerType = ErrorTimerActionType;
