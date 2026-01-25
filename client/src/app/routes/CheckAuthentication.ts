import jwtDecode from 'jwt-decode'; //you must install jwt-decode using npm
import { setAuthenticated, setUnauthenticated } from '../../features/auth/authSlice';
import { attemptLoadUser } from '../../features/auth/thunks';
import { store } from '../store';

export const CheckAuthentication = () => {
    const authToken = localStorage.token;

    if (authToken) {
        const decodedToken: any = jwtDecode(authToken);
        if (decodedToken.exp * 1000 < Date.now()) {
            store.dispatch(setUnauthenticated());
        } else {
            store.dispatch(setAuthenticated());
            store.dispatch(attemptLoadUser());
        }
    }
}
