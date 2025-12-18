import { registerAction, logoutAction, setUserAction, loadingUserAction, loadingUI } from "../actions/auth";
import { Dispatch } from "redux";
import { SetAuthenticatedActionType, SetUnauthenticatedActionType, SetUserActionType, LoadingUserActionType, LoadingUIActionType } from "../types/AuthTypes";
import { register, login, loadUser } from '../api/auth';

export const attemptLogin = (params:any) => async (dispatch: Dispatch<LoadingUIActionType | SetAuthenticatedActionType | SetUserActionType | LoadingUserActionType>) => {
    dispatch(loadingUI(true));
    await login(params)
        .then(response => {
            localStorage.setItem("token", `${response.token}`);//setting token to local storage
            dispatch(attemptLoadUser(response.token) as any);
            dispatch(loadingUserAction());
        })
        .catch(error => error);

    /* when using appwrite as backend */
    // await authApi.createSession(params.email, params.password)
    //             .then(response => {
    //                 dispatch(attemptLoadUser(localStorage.getItem('token')) as any);
    //                 dispatch(loadingUserAction());
    //             })
    //             .catch(error => error);

    // await authApi.createJWT().then(response => {
    //     localStorage.setItem("token", `${response.jwt}`);//setting token to local storage
    //     dispatch(attemptLoadUser(response.token) as any);
    // }).catch(error => error);
    /* when using appwrite as backend */
}

export const attemptLogout = (params:any) => async (dispatch: Dispatch<SetUnauthenticatedActionType>) => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
    window.location.href = "/login";
}

export const attemptRegister = (params:any) => async (dispatch: Dispatch<SetAuthenticatedActionType | SetUnauthenticatedActionType>) => {
    const auth = await register(params)
        .then(response => {
            localStorage.setItem("token", `${response.token}`);//setting token to local storage
            dispatch(attemptLoadUser(response.token) as any);
        })
        .catch(error => {
            dispatch(logoutAction())
            return error;
        });

    /* when using appwrite as backend */
    // const auth = await authApi.register(params)
    //         .then(response => {
    //             return response;
    //         })
    //         .catch(error => {
    //             dispatch(logoutAction())
    //             return error;
    //         });
    // await authApi.createSession(params.email, params.password);

    // await authApi.createJWT().then(response => {
    //     localStorage.setItem("token", `${response.jwt}`);//setting token to local storage
    //     dispatch(attemptLoadUser(response.token) as any);
    // }).catch(error => error);
    /* when using appwrite as backend */

    dispatch(registerAction(auth));
}

export const attemptLoadUser = (params:any) => async (dispatch: Dispatch<SetUserActionType | LoadingUserActionType>) => {
    dispatch(loadingUserAction());

    await loadUser(params)
        .then(response => {
            dispatch(setUserAction(response));
        })
        .catch(error => error);
 
    /* when using appwrite as backend */
    // const auth = await authApi.loadUser(params)
    //     .then(response => {
    //         dispatch(setUserAction(response));
    //     })
    //     .catch(error => error);
 
}