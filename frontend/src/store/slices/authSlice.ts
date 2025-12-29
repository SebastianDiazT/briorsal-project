import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/axios';
import { User } from '@/types';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: any, { dispatch, rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify({ email, password });

            const res = await api.post('auth/jwt/create/', body, config);

            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);

            dispatch(loadUser());

            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.detail || 'Credenciales inválidas'
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
            return rejectWithValue('Error al cargar usuario');
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { dispatch, rejectWithValue }) => {
        const token = localStorage.getItem('access');

        if (token) {
            try {
                const config = {
                    headers: { 'Content-Type': 'application/json' },
                };
                const body = JSON.stringify({ token });

                await api.post('auth/jwt/verify/', body, config);

                dispatch(loadUser());
                return true;
            } catch (err) {
                dispatch(logout());
                return rejectWithValue('Sesión expirada');
            }
        } else {
            dispatch(logout());
            return rejectWithValue('No hay sesión activa');
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
            .addCase(login.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = null;
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            });
    },
});

export default authSlice.reducer;
