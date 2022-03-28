import { registerAction, logoutAction, setUserAction, loadingUserAction, setErrorsAction, loadingUI, clearErrorsAction } from "../actions/auth";
import { Dispatch } from "redux";
import { SetAuthenticatedActionType, SetUnauthenticatedActionType, SetUserActionType, LoadingUserActionType, SetErrorsActionType, LoadingUIActionType, ClearErrorsActionType } from "../types/AuthTypes";
import { register, login, loadUser } from '../api/auth';
import store from "../store";

export const attemptLogin = (params:any) => async (dispatch: Dispatch<LoadingUIActionType | SetAuthenticatedActionType | SetUserActionType | LoadingUserActionType>) => {
    dispatch(loadingUI(true));
    const auth = await login(params)
        .then(response => {
            localStorage.setItem("token", `${response.token}`);//setting token to local storage
            dispatch(loadingUserAction());
            dispatch(attemptLoadUser(response.token) as any);
        })
        .catch(error => error);
}

export const attemptLogout = (params:any) => async (dispatch: Dispatch<SetUnauthenticatedActionType>) => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
    window.location.href = "/login";
}

export const attemptRegister = (params:any) => async (dispatch: Dispatch<SetAuthenticatedActionType | SetUnauthenticatedActionType>) => {
    const auth = await register(params)
        .then(response => {
            let token = `Bearer ${response.data.token}`;
            localStorage.setItem("token", `Bearer ${response.data.token}`);//setting token to local storage
            dispatch(registerAction(auth));
            return response.data
        })
        .catch(error => {
            // deleteToken();
            dispatch(logoutAction())
            return error;
        });

    dispatch(registerAction(auth));
}

export const attemptLoadUser = (params:any) => async (dispatch: Dispatch<SetUserActionType | LoadingUserActionType>) => {
    dispatch(loadingUserAction());
    const auth = await loadUser(params)
        .then(response => {
            console.log(response);
            dispatch(setUserAction(response));
            console.log('state', store.getState());
        })
        .catch(error => error);
 
}