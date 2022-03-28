import { registerAction, logoutAction, setUserAction, loadingUserAction, setErrorsAction, loadingUI, clearErrorsAction } from "../actions/auth";
import { Dispatch } from "redux";
import { SetAuthenticatedActionType, SetUnauthenticatedActionType, SetUserActionType, LoadingUserActionType, SetErrorsActionType, LoadingUIActionType, ClearErrorsActionType } from "../types/AuthTypes";
import { register, login, loadUser } from '../api/auth';

export const attemptLogin = (params:any) => async (dispatch: Dispatch<LoadingUIActionType | SetAuthenticatedActionType | SetUserActionType | LoadingUserActionType>) => {
    dispatch(loadingUI(true));
    let id: string = '';
    const auth = await login(params)
        .then(response => {
            localStorage.setItem("token", `Bearer ${response.token}`);//setting token to local storage
            id = response.payload.user.id;
            localStorage.setItem("id", JSON.stringify(id));//setting user to local storage
        }).then(response => {
            dispatch(loadingUserAction());
            console.log('id',id);
            attemptLoadUser(id);
        })
        .catch(error => {
            // error;
            console.log(error);
            return error;
        });

    // dispatch(loginAction(auth));
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
    console.log('attemptLoadUser',params);
    dispatch(loadingUserAction());
    console.log('attemptLoadUser');
    const auth = await loadUser(params)
        .then(response => {
            dispatch(setUserAction(response.data));
            return response.data
        })
        .catch(error => error);
 
}