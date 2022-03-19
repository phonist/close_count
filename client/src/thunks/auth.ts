import { loginAction, registerAction, loadUserAction } from "../actions/auth";
import { Dispatch } from "redux";
import { LoginActionType, LogoutActionType, RegisterActionType, LoadUserActionType } from "../types/AuthTypes";
import { register, login, loadUser } from '../api/auth';

export const attemptLogin = (params:any) => async (dispatch: Dispatch<LoginActionType>) => {
    const auth = await login(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(loginAction(auth));
}

export const attemptLogout = () => async (dispatch: Dispatch<LogoutActionType>) => {
    dispatch(logout());
}

export const attemptRegister = (params:any) => async (dispatch: Dispatch<RegisterActionType>) => {
    const auth = await register(params)
        .then(response => response.data)
        .catch(error => error);

    dispatch(registerAction(auth));
}

export const attemptLoadUser = () => async (dispatch: Dispatch<LoadUserActionType>) => {
    const auth = await loadUser()
        .then(response => response.data)
        .catch(error => error);

    dispatch(loadUserAction(auth));
}