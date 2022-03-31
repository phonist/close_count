import React from 'react'
import {
    Outlet,
    Navigate
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from '../store';

const GuestRoute = ({ authenticated }: any) => {
    const auth = useSelector((state: AppState) => state.auth);
    return auth.authenticated ? <Navigate to = '/timers' /> : <Outlet />
}

export default GuestRoute;