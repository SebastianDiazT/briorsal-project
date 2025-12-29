import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/axios';
import { Service, CompanyInfo, AboutUs } from '@/types';

interface CompanyState {
    services: Service[];
    count: number;
    companyInfo: CompanyInfo | null;
    aboutUs: AboutUs | null;
    loading: boolean;
    error: string | null;
}

const initialState: CompanyState = {
    services: [],
    count: 0,
    companyInfo: null,
    aboutUs: null,
    loading: false,
    error: null,
};

export const fetchServices = createAsyncThunk(
    'company/fetchServices',
    async ({ page = 1, pageSize = 10 }: { page: number; pageSize: number }, { rejectWithValue }) => {
        try {
            const response = await api.get(`company/services/?page=${page}&page_size=${pageSize}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Error al cargar servicios');
        }
    }
);

export const createService = createAsyncThunk(
    'company/createService',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const res = await api.post('company/services/', formData, config);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Error al crear servicio'
            );
        }
    }
);

export const updateService = createAsyncThunk(
    'company/updateService',
    async (
        { id, formData }: { id: number; formData: FormData },
        { rejectWithValue }
    ) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const res = await api.patch(
                `company/services/${id}/`,
                formData,
                config
            );
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Error al actualizar servicio'
            );
        }
    }
);

export const deleteService = createAsyncThunk(
    'company/deleteService',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`company/services/${id}/`);
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Error al eliminar servicio'
            );
        }
    }
);

export const fetchCompanyInfo = createAsyncThunk(
    'company/fetchCompanyInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('company/info/');
            return Array.isArray(response.data)
                ? response.data[0]
                : response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Error al obtener info'
            );
        }
    }
);

export const updateCompanyInfo = createAsyncThunk(
    'company/updateCompanyInfo',
    async (data: any, { rejectWithValue }) => {
        try {
            const res = await api.patch('company/info/', data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data || 'Error al actualizar info'
            );
        }
    }
);

export const fetchAboutUs = createAsyncThunk(
    'company/fetchAboutUs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('company/about/');
            return Array.isArray(response.data)
                ? response.data[0]
                : response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Error al obtener info'
            );
        }
    }
);

export const updateAboutUs = createAsyncThunk(
    'company/updateAboutUs',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const res = await api.patch('company/about/', formData, config);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Error al actualizar');
        }
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
                state.services = action.payload.results;
                state.count = action.payload.count;
            })
            .addCase(fetchServices.rejected, (state) => {
                state.loading = false;
                state.error = 'Error al cargar servicios';
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.loading = false;
                state.services.push(action.payload);
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.services.findIndex(
                    (s) => s.id === action.payload.id
                );
                if (index !== -1) {
                    state.services[index] = action.payload;
                }
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.loading = false;
                state.services = state.services.filter(
                    (s) => s.id !== action.payload
                );
            });

        builder
            .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.companyInfo = action.payload;
            })
            .addCase(updateCompanyInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.companyInfo = action.payload;
            });

        builder
            .addCase(fetchAboutUs.fulfilled, (state, action) => {
                state.loading = false;
                state.aboutUs = action.payload;
            })
            .addCase(updateAboutUs.fulfilled, (state, action) => {
                state.loading = false;
                state.aboutUs = action.payload;
            });
    },
});

export default companySlice.reducer;
