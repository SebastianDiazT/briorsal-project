import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/axios';
import { Category } from '@/types';

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('categories/?page_size=100');

            if (response.data.results) {
                return response.data.results;
            }
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (name: string, { rejectWithValue }) => {
        try {
            const response = await api.post('categories/', { name });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`categories/${id}/`, { name });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`categories/${id}/`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(
                    (c) => c.id === action.payload.id
                );
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(
                    (c) => c.id !== action.payload
                );
            });
    },
});

export default categorySlice.reducer;
