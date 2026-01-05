import { apiSlice } from '@/store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import { Client } from '../types';

export interface GetClientsArgs {
    page?: number;
    pageSize?: number;
    search?: string;
    no_page?: boolean;
}

export const clientsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClients: builder.query<ApiResponse<Client[]>, GetClientsArgs>({
            query: ({ page = 1, pageSize = 10, search, no_page }) => {
                const params = new URLSearchParams();

                if (no_page) {
                    params.append('no_page', 'true');
                } else {
                    params.append('page', page.toString());
                    params.append('page_size', pageSize.toString());
                }

                if (search) params.append('search', search);

                return `company/clients/?${params.toString()}`;
            },
            providesTags: ['Clients'],
        }),

        createClient: builder.mutation<ApiResponse<Client>, FormData>({
            query: (formData) => ({
                url: 'company/clients/',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Clients'],
        }),

        updateClient: builder.mutation<
            ApiResponse<Client>,
            { id: number; data: FormData }
        >({
            query: ({ id, data }) => ({
                url: `company/clients/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Clients'],
        }),

        deleteClient: builder.mutation<void, number>({
            query: (id) => ({
                url: `company/clients/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Clients'],
        }),
    }),
});

export const {
    useGetClientsQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
} = clientsApi;
