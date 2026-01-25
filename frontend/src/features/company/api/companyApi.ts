import { apiSlice } from '@/store/api/apiSlice';
import { CompanyInfo, CompanyResponse, AboutUsResponse, HomeHeroResponse, ProjectsHeroResponse } from '../types';

export const companyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyInfo: builder.query<CompanyResponse, void>({
            query: () => 'company/info/',
            providesTags: ['Company'],
        }),
        updateCompanyInfo: builder.mutation<
            CompanyResponse,
            Partial<CompanyInfo>
        >({
            query: (data) => ({
                url: 'company/info/',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Company'],
        }),

        getAboutUs: builder.query<AboutUsResponse, void>({
            query: () => 'company/about-us/',
            providesTags: ['Company'],
        }),
        updateAboutUs: builder.mutation<AboutUsResponse, FormData>({
            query: (formData) => ({
                url: 'company/about-us/',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['Company'],
        }),

        getHomeHero: builder.query<HomeHeroResponse, void>({
            query: () => 'company/home-hero/',
            providesTags: ['Company'],
        }),
        updateHomeHero: builder.mutation<HomeHeroResponse, FormData>({
            query: (formData) => ({
                url: 'company/home-hero/',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['Company'],
        }),

        getProjectsHero: builder.query<ProjectsHeroResponse, void>({
            query: () => 'company/projects-hero/',
            providesTags: ['Company'],
        }),
        updateProjectsHero: builder.mutation<ProjectsHeroResponse, FormData>({
            query: (formData) => ({
                url: 'company/projects-hero/',
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['Company'],
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
