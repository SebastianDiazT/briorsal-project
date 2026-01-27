import { apiSlice } from '@/store/api/apiSlice';
import {
    CompanyInfo,
    AboutUs,
    HomeHero,
    ProjectsHero,
} from '../types';

import { ApiResponse } from '@/types/api';

export const companyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyInfo: builder.query<ApiResponse<CompanyInfo>, void>({
            query: () => 'company/info/',
            providesTags: ['Company'],
        }),
        updateCompanyInfo: builder.mutation<
            ApiResponse<CompanyInfo>,
            Partial<CompanyInfo>
        >({
            query: (data) => ({
                url: 'company/info/',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Company'],
        }),

        getAboutUs: builder.query<ApiResponse<AboutUs>, void>({
            query: () => 'company/about-us/',
            providesTags: ['AboutUs'],
        }),
        updateAboutUs: builder.mutation<ApiResponse<AboutUs>, FormData>({
            query: (formData) => ({
                url: 'company/about-us/',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['AboutUs'],
        }),

        getHomeHero: builder.query<ApiResponse<HomeHero>, void>({
            query: () => 'company/home-hero/',
            providesTags: ['HomeHero'],
        }),
        updateHomeHero: builder.mutation<ApiResponse<HomeHero>, FormData>({
            query: (formData) => ({
                url: 'company/home-hero/',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['HomeHero'],
        }),

        getProjectsHero: builder.query<ApiResponse<ProjectsHero>, void>({
            query: () => 'company/projects-hero/',
            providesTags: ['ProjectsHero'],
        }),
        updateProjectsHero: builder.mutation<
            ApiResponse<ProjectsHero>,
            FormData
        >({
            query: (formData) => ({
                url: 'company/projects-hero/',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['ProjectsHero'],
        }),
    }),
});

export const {
    useGetCompanyInfoQuery,
    useUpdateCompanyInfoMutation,
    useGetAboutUsQuery,
    useUpdateAboutUsMutation,
    useGetHomeHeroQuery,
    useUpdateHomeHeroMutation,
    useGetProjectsHeroQuery,
    useUpdateProjectsHeroMutation,
} = companyApi;
