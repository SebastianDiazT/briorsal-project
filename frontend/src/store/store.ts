import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import companyReducer from './slices/companySlice';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        company: companyReducer,
        auth: authReducer,
        categories: categoryReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
