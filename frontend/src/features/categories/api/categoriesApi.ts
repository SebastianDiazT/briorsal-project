import { apiSlice } from '@store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import {
    Category,
    GetCategoriesArgs,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from '../types';

export const categoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<
            ApiResponse<Category[]>,
            GetCategoriesArgs | void
        >({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    if (args.no_page) params.append('no_page', 'true');
                    else {
                        if (args.page)
                            params.append('page', args.page.toString());
                        if (args.pageSize)
                            params.append(
                                'page_size',
                                args.pageSize.toString()
                            );
                    }
                    if (args.search) params.append('search', args.search);
                }
                return `categories/?${params.toString()}`;
            },
            providesTags: ['Categories'],
        }),

        getCategoryById: builder.query<Category, number>({
            query: (id) => `categories/${id}/`,
            transformResponse: (response: ApiResponse<Category>) =>
                response.data,
            providesTags: (_result, _err, id) => [{ type: 'Categories', id }],
        }),

        createCategory: builder.mutation<Category, CreateCategoryRequest>({
            query: (data) => ({
                url: 'categories/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Categories'],
        }),

        updateCategory: builder.mutation<Category, UpdateCategoryRequest>({
            query: ({ id, data }) => ({
                url: `categories/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Categories', 'Projects'],
        }),

        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `categories/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories', 'Projects'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;
