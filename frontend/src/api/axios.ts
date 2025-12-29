import axios from 'axios';
import { toast } from 'react-hot-toast';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');

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
            if (window.location.pathname !== '/admin/login') {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');

                toast.error('Tu sesión ha expirado. Ingresa nuevamente.', {
                    duration: 4000,
                    icon: '🔒',
                });

                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 1000);
            }
        }
        return Promise.reject(error);
    }
);

export default api;