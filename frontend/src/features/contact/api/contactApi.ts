import { apiSlice } from '@/store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import { ContactMessage, ContactMessageRequest } from '../types';

export interface GetContactMessagesArgs {
    page?: number;
    pageSize?: number;
    search?: string;
    no_page?: boolean;
}

export const contactApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getContactMessages: builder.query<
            ApiResponse<ContactMessage[]>,
            GetContactMessagesArgs
        >({
            query: ({ page = 1, pageSize = 10, search, no_page }) => {
                const params = new URLSearchParams();
                if (no_page) {
                    params.append('no_page', 'true');
                } else {
                    params.append('page', page.toString());
                    params.append('page_size', pageSize.toString());
                }
                if (search) params.append('search', search);

                return `contact/messages/?${params.toString()}`;
            },
            providesTags: ['ContactMessages'],
        }),

        createContactMessage: builder.mutation<
            ApiResponse<ContactMessage>,
            ContactMessageRequest
        >({
            query: (data) => ({
                url: 'contact/messages/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ContactMessages'],
        }),

        updateContactMessageStatus: builder.mutation<
            ApiResponse<ContactMessage>,
            { id: number; is_read: boolean }
        >({
            query: ({ id, is_read }) => ({
                url: `contact/messages/${id}/`,
                method: 'PATCH',
                body: { is_read },
            }),
            invalidatesTags: ['ContactMessages'],
        }),
    }),
});

export const {
    useCreateContactMessageMutation,
    useGetContactMessagesQuery,
    useUpdateContactMessageStatusMutation,
} = contactApi;
