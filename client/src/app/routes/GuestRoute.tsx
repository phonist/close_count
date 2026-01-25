import {
    Outlet,
    Navigate
} from 'react-router-dom'
import { useAppSelector } from '../hooks';

const GuestRoute = () => {
    const auth = useAppSelector((state) => state.auth);
    return auth.authenticated ? <Navigate to = '/timers' /> : <Outlet />
}

export default GuestRoute;
