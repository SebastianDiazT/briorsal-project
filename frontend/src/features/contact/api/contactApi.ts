import { apiSlice } from '@/store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import { ContactMessage, ContactMessageRequest, ContactStatus } from '../types';

export interface GetContactMessagesArgs {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    inquiry_type?: string;
    ordering?: string;
}

export interface UpdateContactMessageArgs {
    id: number;
    data: {
        status?: ContactStatus;
        admin_notes?: string;
        is_read?: boolean;
    };
}

export const contactApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getContactMessages: builder.query<
            ApiResponse<ContactMessage[]>,
            GetContactMessagesArgs
        >({
            query: ({
                page = 1,
                pageSize = 10,
                search,
                status,
                inquiry_type,
                ordering,
            }) => {
                const params = new URLSearchParams();

                params.append('page', page.toString());
                params.append('page_size', pageSize.toString());

                if (search) params.append('search', search);
                if (status) params.append('status', status);
                if (inquiry_type) params.append('inquiry_type', inquiry_type);
                if (ordering) params.append('ordering', ordering);

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

        updateContactMessage: builder.mutation<
            ApiResponse<ContactMessage>,
            UpdateContactMessageArgs
        >({
            query: ({ id, data }) => ({
                url: `contact/messages/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['ContactMessages'],
        }),
    }),
});

export const {
    useGetContactMessagesQuery,
    useCreateContactMessageMutation,
    useUpdateContactMessageMutation,
} = contactApi;
