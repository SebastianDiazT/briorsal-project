export interface CategoryShort {
    id: number;
    name: string;
}

export interface ProjectImage {
    id: number;
    image: string;
}

export interface ProjectVideo {
    id: number;
    video: string;
}

export interface Project {
    id: number;
    slug: string;
    name: string;
    description?: string;
    categories: CategoryShort[];
    cover_image: string | null;
    sort_order: number;
    year: number | null;
    location: string;
    service_type: string | null;
    levels: string | null;
    area: string | null;
    status: 'en_proceso' | 'entregado';
    extra_info: Record<string, any> | null;
    is_featured: boolean;
    images: ProjectImage[];
    videos: ProjectVideo[];
    created_at: string;
    updated_at: string;
}

export interface GetProjectsArgs {
    page?: number;
    pageSize?: number;
    search?: string;
    categories?: string;
    status?: string;
    is_featured?: boolean;
    no_page?: boolean;
    ordering?: string;
}

export type CreateProjectRequest = FormData;
export type UpdateProjectRequest = { slug: string; data: FormData };

export interface ReorderProjectItem {
    id: number;
    sort_order: number;
}
export interface ReorderProjectsRequest {
    items: ReorderProjectItem[];
}