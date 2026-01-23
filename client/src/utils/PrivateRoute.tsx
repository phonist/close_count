import {
    Navigate,
    Outlet
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from '../store';

const PrivateRoute = () => {
    const auth = useSelector((state: AppState) => state.auth);
    return auth.authenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute;
