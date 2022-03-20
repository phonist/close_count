import { Timer } from '../interfaces/Timer';

export const GET_TIMERS = 'GET_TIMERS';
export const CREATE_TIMER = 'CREATE_TIMER';
export const STORE_TIMER = 'STORE_TIMER';
export const SHOW_TIMER = 'SHOW_TIMER';
export const EDIT_TIMER = 'EDIT_TIMER';
export const UPDATE_TIMER = 'UPDATE_TIMER';
export const DESTROY_TIMER = 'DESTROY_TIMER';
export const ERROR_TIMER = 'ERROR_TIMER';

export interface GetTimersStateType {
    timers: Timer;
    isAuthenticated: Boolean;
    loading: Boolean;
    error: String;
}

interface GetTimersActionType {
    type: typeof GET_TIMERS;
    payload: Timer;
}
export type GetTimersType = GetTimersActionType;

interface CreateTimerActionType {
    type: typeof CREATE_TIMER;
    payload: Timer;
}
export type CreateTimerType = CreateTimerActionType;

interface StoreTimerActionType {
    type: typeof STORE_TIMER;
    payload: Timer;
}
export type StoreTimerType = StoreTimerActionType;

interface ShowTimerActionType {
    type: typeof SHOW_TIMER;
    payload: Timer;
}
export type ShowTimerType = ShowTimerActionType;

interface EditTimerActionType {
    type: typeof EDIT_TIMER;
    payload: Timer;
}
export type EditTimerType = EditTimerActionType;

interface UpdateTimerActionType {
    type: typeof UPDATE_TIMER;
    payload: Timer;
}
export type UpdateTimerType = UpdateTimerActionType;

interface DestroyTimerActionType {
    type: typeof DESTROY_TIMER;
    payload: Timer;
}
export type DestroyTimerType = DestroyTimerActionType;

interface ErrorTimerActionType {
    type: typeof ERROR_TIMER;
    payload: Timer;
}
export type ErrorTimerType = ErrorTimerActionType;