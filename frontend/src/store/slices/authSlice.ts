import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    user: string | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('auth_token'),
    user: localStorage.getItem('user_data') || null,
    token: localStorage.getItem('auth_token') || null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: string; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_data', user);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
