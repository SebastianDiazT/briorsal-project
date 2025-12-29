import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import companyReducer from './slices/companySlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        company: companyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
