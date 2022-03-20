import { Auth } from '../interfaces/Auth'

export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';
export const LOADED_USER = 'LOADED_USER';

export interface GetAuthsStateType {
    auth: Auth;
    isAuthenticated: Boolean;
    loading: Boolean;
    error: String;
    token: String;
}

interface AuthLogoutActionType {
    type: typeof LOGOUT;
}
export type LogoutActionType = AuthLogoutActionType;

interface AuthLoginActionType {
    type: typeof LOGIN;
    payload: Auth;
}
export type LoginActionType = AuthLoginActionType;

interface AuthRegisterActionType {
    type: typeof REGISTER;
    payload: Auth;
}
export type RegisterActionType = AuthRegisterActionType;

interface AuthLoadUserActionType {
    type: typeof LOADED_USER;
    payload: Auth;
}
export type LoadUserActionType = AuthLoadUserActionType;