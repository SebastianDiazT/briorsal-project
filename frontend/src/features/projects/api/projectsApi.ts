import { apiSlice } from '@store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import { Project, ProjectImage, ProjectVideo, GetProjectsArgs, CreateProjectRequest, UpdateProjectRequest } from '../types';

export const projectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<ApiResponse<Project[]>, GetProjectsArgs>({
            query: ({ page = 1, pageSize = 10, search, category, status, is_featured, no_page }) => {
                const params = new URLSearchParams();

                if (no_page) {
                    params.append('no_page', 'true');
                } else {
                    params.append('page', page.toString());
                    params.append('page_size', pageSize.toString());
                }

                if (search) params.append('search', search);
                if (category) params.append('category', category);
                if (status) params.append('status', status);
                if (is_featured) params.append('is_featured', is_featured.toString());

                return `projects/?${params.toString()}`;
            },
            providesTags: ['Projects'],
        }),

        getProjectBySlug: builder.query<Project, string>({
            query: (slug) => `projects/${slug}/`,
            transformResponse: (response: ApiResponse<Project>) =>
                response.data,
            providesTags: (_result, _err, slug) => [
                { type: 'Projects', id: slug },
            ],
        }),

        createProject: builder.mutation<Project, CreateProjectRequest>({
            query: (data) => ({
                url: 'projects/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Projects'],
        }),

        updateProject: builder.mutation<Project, UpdateProjectRequest>({
            query: ({ slug, data }) => ({
                url: `projects/${slug}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Projects'],
        }),

        deleteProject: builder.mutation<void, string>({
            query: (slug) => ({
                url: `projects/${slug}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Projects'],
        }),

        updateProjectImage: builder.mutation<
            ProjectImage,
            { id: number; file: File }
        >({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append('image', file);
                return {
                    url: `project-images/${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            invalidatesTags: ['Projects'],
        }),

        deleteProjectImage: builder.mutation<void, number>({
            query: (imageId) => ({
                url: `project-images/${imageId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Projects'],
        }),

        updateProjectVideo: builder.mutation<ProjectVideo, { id: number; file: File }>({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append('video', file);
                return {
                    url: `project-videos/${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            invalidatesTags: ['Projects'],
        }),

        deleteProjectVideo: builder.mutation<void, number>({
            query: (videoId) => ({
                url: `project-videos/${videoId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Projects'],
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectBySlugQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useDeleteProjectImageMutation,
    useDeleteProjectVideoMutation,
    useUpdateProjectImageMutation,
    useUpdateProjectVideoMutation,
} = projectsApi;
