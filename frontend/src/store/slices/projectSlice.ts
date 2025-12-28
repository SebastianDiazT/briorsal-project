import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/axios';

export interface ProjectImage {
    id: number;
    image: string;
}
export interface ProjectVideo {
    id: number;
    video: string;
}

export interface Project {
    id: number;
    name: string;
    slug: string;
    category: number;
    category_name?: string;
    location: string;
    service_type: string;
    levels: string;
    area: string;
    extra_info: string;
    status: string;
    is_featured: boolean;
    images: ProjectImage[];
    videos: ProjectVideo[];
}

export interface Category {
    id: number;
    name: string;
}

interface ProjectState {
    projects: Project[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    currentProject: Project | null;
    count: number;
    next: string | null;
    previous: string | null;
}

const initialState: ProjectState = {
    projects: [],
    categories: [],
    loading: false,
    error: null,
    currentProject: null,
    count: 0,
    next: null,
    previous: null,
};

interface FetchParams {
    page?: number;
    search?: string;
    category?: string;
    status?: string;
    is_featured?: boolean;
}

export const fetchProjects = createAsyncThunk(
    'projects/fetchAll',
    async (params: FetchParams = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.search) queryParams.append('search', params.search);
            if (params.category && params.category !== 'ALL')
                queryParams.append('category', params.category);
            if (params.status && params.status !== 'ALL')
                queryParams.append('status', params.status);
            if (params.is_featured) queryParams.append('is_featured', 'true');

            const response = await api.get(
                `projects/?${queryParams.toString()}`
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue('Error al cargar proyectos');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'projects/fetchCategories',
    async () => {
        const response = await api.get('categories/');
        return response.data;
    }
);

export const fetchProjectBySlug = createAsyncThunk(
    'projects/fetchOne',
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`projects/${slug}/`);
            return response.data;
        } catch (error) {
            return rejectWithValue('Proyecto no encontrado');
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/create',
    async (projectData: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post('projects/', projectData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Error al crear proyecto'
            );
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/update',
    async (
        { slug, data }: { slug: string; data: FormData },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.patch(`projects/${slug}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Error al actualizar'
            );
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/delete',
    async ({ id, slug }: { id: number; slug: string }, { rejectWithValue }) => {
        try {
            await api.delete(`projects/${slug}/`);
            return id;
        } catch (error) {
            return rejectWithValue('No se pudo eliminar');
        }
    }
);

export const deleteProjectImage = createAsyncThunk(
    'projects/deleteImage',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`project-images/${id}/`);
            return id;
        } catch (error) {
            return rejectWithValue('Error al eliminar imagen');
        }
    }
);

export const deleteProjectVideo = createAsyncThunk(
    'projects/deleteVideo',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`project-videos/${id}/`);
            return id;
        } catch (error) {
            return rejectWithValue('Error al eliminar video');
        }
    }
);

export const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.results) {
                    state.projects = action.payload.results;
                    state.count = action.payload.count;
                    state.next = action.payload.next;
                    state.previous = action.payload.previous;
                } else {
                    state.projects = action.payload;
                    state.count = action.payload.length;
                }
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.results;
            })
            .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
                state.currentProject = action.payload;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(
                    (p) => p.id === action.payload.id
                );
                if (index !== -1) state.projects[index] = action.payload;
                state.currentProject = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(
                    (p) => p.id !== action.payload
                );
            });
    },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
