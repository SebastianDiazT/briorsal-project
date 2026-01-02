import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import companyReducer from './slices/companySlice';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import projectsReducer from './slices/projectSlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        company: companyReducer,
        auth: authReducer,
        categories: categoryReducer,
        projects: projectsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
