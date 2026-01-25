import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Auth } from './types';

interface AuthState {
  authenticated: boolean;
  loading: boolean;
  credentials: Auth;
}

const emptyAuth: Auth = {
  _id: '',
  avatar: '',
  date: '',
  email: '',
  name: '',
  password: '',
};

const initialState: AuthState = {
  authenticated: false,
  loading: false,
  credentials: emptyAuth,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.authenticated = true;
    },
    setUnauthenticated: () => initialState,
    setUser: (state, action: PayloadAction<Auth>) => {
      state.authenticated = true;
      state.loading = false;
      state.credentials = action.payload;
    },
    setLoadingUser: (state) => {
      state.loading = true;
    },
  },
});

export const { setAuthenticated, setUnauthenticated, setUser, setLoadingUser } = authSlice.actions;
export default authSlice.reducer;
