import jwtDecode from 'jwt-decode'; //you must install jwt-decode using npm
import {
    logoutAction,
    setUserAction
} from '../actions/auth';
import store from '../store';
import { attemptLoadUser } from '../thunks/auth';
import {
    SET_AUTHENTICATED,
} from '../types/AuthTypes';

export const CheckAuthentication = () => {
    const authToken = localStorage.token;

    if (authToken) {
        const decodedToken: any = jwtDecode(authToken);
        console.log(decodedToken.iss);
        if (decodedToken.exp * 1000 < Date.now()) {
            store.dispatch(logoutAction());
        } else {
            store.dispatch({
                type: SET_AUTHENTICATED
            });
            let id: string = localStorage.id;
            store.dispatch(attemptLoadUser(id) as any);
        }
    }
}