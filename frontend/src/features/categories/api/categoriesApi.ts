import { apiSlice } from '@store/api/apiSlice';
import { ApiResponse } from '@/types/api';

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export const categoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => 'categories/',
            transformResponse: (response: ApiResponse<Category[]>) =>
                response.data,
            providesTags: ['Categories'],
        }),
    }),
});

export const { useGetCategoriesQuery } = categoriesApi;
