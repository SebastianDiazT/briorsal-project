import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@api/axios';
import { Project } from '@/types';

interface ProjectState {
    projects: Project[];
    count: number;
    currentProject: Project | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    projects: [],
    count: 0,
    currentProject: null,
    loading: false,
    error: null,
};

// Obtener todos los proyectos
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async ({ page = 1, pageSize = 10 }: { page: number; pageSize: number }, { rejectWithValue }) => {
        try {
            const response = await api.get(`projects/?page=${page}&page_size=${pageSize}`);
            return response.data.results
                ? response.data.results
                : response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Obtener un solo proyecto por Slug
export const fetchProjectBySlug = createAsyncThunk(
    'projects/fetchProjectBySlug',
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`projects/${slug}/`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Crear proyecto (FormData es necesario para subir archivos)
export const createProject = createAsyncThunk(
    'projects/createProject',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post('projects/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Actualizar proyecto
export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async (
        { slug, data }: { slug: string; data: FormData },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.patch(`projects/${slug}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Eliminar proyecto
export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (slug: string, { rejectWithValue }) => {
        try {
            await api.delete(`projects/${slug}/`);
            return slug;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const updateProjectImage = createAsyncThunk(
    'projects/updateProjectImage',
    async ({ id, file }: { id: number; file: File }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            // Usamos PATCH para actualizar parcialmente (solo la imagen)
            const response = await api.patch(
                `project-images/${id}/`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const deleteProjectImage = createAsyncThunk(
    'projects/deleteProjectImage',
    async (id: number, { rejectWithValue }) => {
        try {
            // Asumiendo que la ruta en urls.py es 'project-images'
            await api.delete(`project-images/${id}/`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// --- AGREGAR ESTO: Eliminar video individual ---
export const deleteProjectVideo = createAsyncThunk(
    'projects/deleteProjectVideo',
    async (id: number, { rejectWithValue }) => {
        try {
            // Asumiendo que la ruta en urls.py es 'project-videos'
            await api.delete(`project-videos/${id}/`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.count = action.payload.count;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Single
            .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
                state.currentProject = action.payload;
            })
            // Create
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
            })
            // Update
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(
                    (p) => p.id === action.payload.id
                );
                if (index !== -1) state.projects[index] = action.payload;
                state.currentProject = action.payload;
            })
            // Delete
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(
                    (p) => p.slug !== action.payload
                );
            });
    },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
