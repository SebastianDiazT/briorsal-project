import { apiSlice } from '@store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import { LoginRequest, LoginResponse, User } from '../types';


export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'auth/jwt/create/',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response: ApiResponse<LoginResponse>) => response.data,
        }),
        getMe: builder.query<User, void>({
            query: () => 'auth/users/me/',
            transformResponse: (response: ApiResponse<User>) => response.data,
        }),

    }),
});

export const { useLoginMutation, useLazyGetMeQuery } = authApi;
