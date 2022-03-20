// import api from '../utils/api';
// import { setAlert } from './alert';
// import {
//   REGISTER_SUCCESS,
//   REGISTER_FAIL,
//   USER_LOADED,
//   AUTH_ERROR,
//   LOGIN_SUCCESS,
//   LOGIN_FAIL,
//   LOGOUT
// } from './types';
import { 
  LOGIN, LOGOUT, REGISTER, LOADED_USER,
  LoginActionType, LogoutActionType, RegisterActionType, LoadUserActionType
} from '../types/AuthTypes';
import { Auth } from "../interfaces/Auth";

export const registerAction = (auth: Auth) : RegisterActionType => ({
    type: REGISTER,
    payload: auth,
});

export const loginAction = (auth: Auth) : LoginActionType => ({
    type: LOGIN,
    payload: auth,
});

export const logoutAction = () : LogoutActionType => ({
    type: LOGOUT,
});

export const loadUserAction = (auth: Auth) : LoadUserActionType => ({
    type: LOADED_USER,
    payload: auth,
});