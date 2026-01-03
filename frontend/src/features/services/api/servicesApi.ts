import { apiSlice } from '@/store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import { Service, GetServicesArgs } from '../types';

export const servicesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query<ApiResponse<Service[]>, GetServicesArgs>({
            query: ({ page = 1, search, no_page, pageSize = 10 }) => {
                const params = new URLSearchParams();
                if (no_page) {
                    params.append('no_page', 'true');
                } else {
                    params.append('page', page.toString());
                    params.append('page_size', pageSize.toString());
                }
                if (search) params.append('search', search);
                return `company/services/?${params.toString()}`;
            },
            providesTags: ['Services'],
        }),

        getServiceById: builder.query<Service, number>({
            query: (id) => `company/services/${id}/`,
            transformResponse: (response: ApiResponse<Service>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'Services', id }],
        }),

        createService: builder.mutation<ApiResponse<Service>, FormData>({
            query: (formData) => ({
                url: 'company/services/',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Services'],
        }),

        updateService: builder.mutation<
            ApiResponse<Service>,
            { id: number; data: FormData }
        >({
            query: ({ id, data }) => ({
                url: `company/services/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Services'],
        }),

        deleteService: builder.mutation<void, number>({
            query: (id) => ({
                url: `company/services/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Services'],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = servicesApi;
