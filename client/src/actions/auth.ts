import { 
    SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_USER, LOADING_USER, SET_ERRORS, LOADING_UI, CLEAR_ERRORS,
    SetAuthenticatedActionType, SetUnauthenticatedActionType, SetUserActionType, LoadingUserActionType, SetErrorsActionType, LoadingUIActionType, ClearErrorsActionType
} from '../types/AuthTypes';
import { Auth } from "../interfaces/Auth";

export const registerAction = (auth: Auth) : SetAuthenticatedActionType => ({
    type: SET_AUTHENTICATED,
    payload: auth,  
});

export const logoutAction = () : SetUnauthenticatedActionType => ({
    type: SET_UNAUTHENTICATED,
});

export const setUserAction = (auth: Auth) : SetUserActionType => ({
    type: SET_USER,
    payload: auth,
});

export const loadingUserAction = () : LoadingUserActionType => ({
    type: LOADING_USER,
});

export const setErrorsAction = (errors: string) : SetErrorsActionType => ({
    type: SET_ERRORS,
    payload: errors,
});

export const loadingUI = (loading: boolean) : LoadingUIActionType => ({
    type: LOADING_UI,
    payload: loading,
});

export const clearErrorsAction = () : ClearErrorsActionType => ({
    type: CLEAR_ERRORS,
});