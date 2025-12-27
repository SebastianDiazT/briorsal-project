import axios from 'axios';
import { store } from '@store/store';
import { logout } from '@store/slices/authSlice';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (!error.config.url.includes('/token/')) {
                store.dispatch(logout());
                toast.error('Tu sesión ha expirado. Ingresa nuevamente.');
            }
        }
        return Promise.reject(error);
    }
);

export default api;