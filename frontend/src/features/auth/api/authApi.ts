import { apiSlice } from '@store/api/apiSlice';
import { ApiResponse } from '@/types/api';
import {
    LoginRequest,
    LoginResponse,
    User,
    ResetPasswordRequest,
    ResetPasswordConfirmRequest,
} from '../types';


export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'auth/jwt/create/',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response: ApiResponse<LoginResponse>) =>
                response.data,
        }),
        getMe: builder.query<User, void>({
            query: () => 'auth/users/me/',
            transformResponse: (response: ApiResponse<User>) => response.data,
            providesTags: ['User'],
        }),
        resetPassword: builder.mutation<void, ResetPasswordRequest>({
            query: (body) => ({
                url: 'auth/users/reset_password/',
                method: 'POST',
                body,
            }),
        }),

        resetPasswordConfirm: builder.mutation<
            void,
            ResetPasswordConfirmRequest
        >({
            query: (body) => ({
                url: 'auth/users/reset_password_confirm/',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLazyGetMeQuery,
    useGetMeQuery,
    useResetPasswordMutation,
    useResetPasswordConfirmMutation,
} = authApi;
