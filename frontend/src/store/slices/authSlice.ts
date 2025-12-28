import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/axios';

interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    is_staff: boolean;
}

interface AuthState {
    access: string | null;
    refresh: string | null;
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: any, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify({ email, password });
            const res = await api.post('auth/jwt/create/', body, config);

            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);

            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.detail || 'Error al iniciar sesión'
            );
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('auth/users/me/');
            return res.data;
        } catch (err: any) {
            return rejectWithValue('Falló al cargar usuario');
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { dispatch }) => {
        const access = localStorage.getItem('access');
        if (access) {
            try {
                const body = JSON.stringify({ token: access });
                await api.post('auth/jwt/verify/', body);

                dispatch(loadUser());
                return true;
            } catch (err) {
                dispatch(logout());
                return false;
            }
        } else {
            dispatch(logout());
            return false;
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return true;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.access = action.payload.access;
                state.refresh = action.payload.refresh;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loadUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(checkAuth.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isAuthenticated = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.access = null;
                state.refresh = null;
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export default authSlice.reducer;
