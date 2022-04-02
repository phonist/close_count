import { Auth } from '../interfaces/Auth'

//user reducer types
export const SET_AUTHENTICATED='SET_AUTHENTICATED';
export const SET_UNAUTHENTICATED='SET_UNAUTHENTICATED';
export const SET_USER='SET_USER';
export const LOADING_USER='LOADING_USER';
//UI reducer types
export const SET_ERRORS='SET_ERRORS';
export const LOADING_UI='LOADING_UI';
export const CLEAR_ERRORS='CLEAR_ERRORS';

export interface GetAuthsStateType {
    authenticated: Boolean,
    loading: Boolean,
    credentials: Auth,
}

export interface GetUIStateType {
    loading: Boolean;
    errors: string;
}

interface AuthSetAuthenticatedActionType {
    type: typeof SET_AUTHENTICATED;
    payload: Auth;
}
export type SetAuthenticatedActionType = AuthSetAuthenticatedActionType;

interface AuthSetUnauthenticatedActionType {
    type: typeof SET_UNAUTHENTICATED;
}
export type SetUnauthenticatedActionType = AuthSetUnauthenticatedActionType;

interface AuthSetUserActionType {
    type: typeof SET_USER;
    payload: Auth;
}
export type SetUserActionType = AuthSetUserActionType;

interface AuthLoadingUserActionType {
    type: typeof LOADING_USER;
}
export type LoadingUserActionType = AuthLoadingUserActionType;

//UI reducer types
interface AuthSetErrorsActionType {
    type: typeof SET_ERRORS;
    payload: string;
}
export type SetErrorsActionType = AuthSetErrorsActionType;

interface AuthLoadingUIActionType {
    type: typeof LOADING_UI;
    payload: boolean;
}
export type LoadingUIActionType = AuthLoadingUIActionType;

interface AuthClearErrorsActionType {
    type: typeof CLEAR_ERRORS;
}
export type ClearErrorsActionType = AuthClearErrorsActionType;


