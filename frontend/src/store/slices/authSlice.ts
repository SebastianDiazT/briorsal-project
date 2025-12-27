import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/axios';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }: any, { rejectWithValue }) => {
        try {
            const response = await api.post('token/', {
                username,
                password,
            });
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(
                    error.response.data.detail || 'Credenciales inválidas'
                );
            }
            return rejectWithValue('Error de conexión con el servidor');
        }
    }
);

interface AuthState {
    isAuthenticated: boolean;
    user: string | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('auth_token'),
    user: localStorage.getItem('user_data') || null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.access;
                localStorage.setItem('auth_token', action.payload.access);
                if (action.payload.refresh)
                    localStorage.setItem(
                        'refresh_token',
                        action.payload.refresh
                    );
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
