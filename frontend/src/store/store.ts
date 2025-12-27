import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import projectReducer from './slices/projectSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        projects: projectReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
