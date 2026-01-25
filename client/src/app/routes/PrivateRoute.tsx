import {
    Navigate,
    Outlet
} from 'react-router-dom'
import { useAppSelector } from '../hooks';

const PrivateRoute = () => {
    const auth = useAppSelector((state) => state.auth);
    return auth.authenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute;
