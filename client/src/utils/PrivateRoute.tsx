import React from 'react'

import {
    Navigate,
    Outlet
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from '../store';

const PrivateRoute = ({ authenticated }:any) => {
    const auth = useSelector((state: AppState) => state.auth);
    return auth.authenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute;