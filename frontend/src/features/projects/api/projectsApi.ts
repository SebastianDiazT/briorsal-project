import { apiSlice } from '@/store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import {
    Project,
    ProjectCard,
    ProjectImage,
    ProjectVideo,
    GetProjectsArgs,
    CreateProjectRequest,
    UpdateProjectRequest,
    ReorderProjectsRequest,
    CategoryShort,
} from '../types';

export const projectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<ApiResponse<ProjectCard[]>, GetProjectsArgs>(
            {
                query: ({
                    page = 1,
                    pageSize = 10,
                    search,
                    categories,
                    status,
                    is_featured,
                    no_page,
                    ordering,
                }) => {
                    const params = new URLSearchParams();

                    if (no_page) {
                        params.append('no_page', 'true');
                    } else {
                        params.append('page', page.toString());
                        params.append('page_size', pageSize.toString());
                    }

                    if (search) params.append('search', search);
                    if (categories) params.append('categories', categories);
                    if (status) params.append('status', status);
                    if (is_featured)
                        params.append('is_featured', is_featured.toString());
                    if (ordering) params.append('ordering', ordering);

                    return `projects/list/?${params.toString()}`;
                },
                providesTags: ['Projects'],
            }
        ),

        getProjectBySlug: builder.query<Project, string>({
            query: (slug) => `projects/list/${slug}/`,
            transformResponse: (response: ApiResponse<Project>) =>
                response.data,
            providesTags: (_result, _err, slug) => [
                { type: 'Projects', id: slug },
            ],
        }),

        createProject: builder.mutation<Project, CreateProjectRequest>({
            query: (data) => ({
                url: 'projects/list/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Projects', 'Categories'],
        }),

        updateProject: builder.mutation<Project, UpdateProjectRequest>({
            query: ({ slug, data }) => ({
                url: `projects/list/${slug}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, arg) => [
                'Projects',
                { type: 'Projects', id: arg.slug },
            ],
        }),

        deleteProject: builder.mutation<void, string>({
            query: (slug) => ({
                url: `projects/list/${slug}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Projects', 'Categories'],
        }),

        reorderProjects: builder.mutation<void, ReorderProjectsRequest>({
            query: (reorderData) => ({
                url: 'projects/list/reorder/',
                method: 'POST',
                body: reorderData,
            }),
            invalidatesTags: ['Projects'],
        }),

        getCategories: builder.query<ApiResponse<CategoryShort[]>, void>({
            query: () => 'projects/categories/',
            providesTags: ['Categories'],
        }),

        updateProjectImage: builder.mutation<
            ProjectImage,
            { id: number; file: File }
        >({
            query: ({ id, file }) => {
                const formData = new FormData();
                formData.append('image', file);
                return {
                    url: `projects/images/${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            invalidatesTags: ['Projects'],
        }),

        deleteProjectImage: builder.mutation<void, number>({
            query: (imageId) => ({
                url: `projects/images/${imageId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Projects'],
        }),

        updateProjectVideo: builder.mutation<
            ProjectVideo,
            { id: number; file: File; title?: string }
        >({
            query: ({ id, file, title }) => {
                const formData = new FormData();
                if (file) formData.append('video', file);
                if (title) formData.append('title', title);
                return {
                    url: `projects/videos/${id}/`,
                    method: 'PATCH',
                    body: formData,
                };
            },
            invalidatesTags: ['Projects'],
        }),

        deleteProjectVideo: builder.mutation<void, number>({
            query: (videoId) => ({
                url: `projects/videos/${videoId}/`,
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
    useReorderProjectsMutation,
    useGetCategoriesQuery,
    useUpdateProjectImageMutation,
    useDeleteProjectImageMutation,
    useUpdateProjectVideoMutation,
    useDeleteProjectVideoMutation,
} = projectsApi;
