import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/axios';
import { Service } from '@/types';

interface CompanyState {
    services: Service[];
    loading: boolean;
}

const initialState: CompanyState = { services: [], loading: false };

export const fetchServices = createAsyncThunk(
    'company/fetchServices',
    async () => {
        const response = await api.get('company/services/');
        return response.data.results;
    }
);

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default companySlice.reducer;
