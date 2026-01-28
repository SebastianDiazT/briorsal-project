export interface CategoryShort {
    id: number;
    name: string;
    project_count?: number;
}

export interface ProjectImage {
    id: number;
    image_url: string;
}

export interface ProjectVideo {
    id: number;
    title: string;
    video_url: string;
}

export interface ProjectCard {
    id: number;
    name: string;
    slug: string;
    cover: string | null;
    category_names: string[];
    location: string;
    year: number | null;
    is_featured: boolean;
    status: 'en_proceso' | 'entregado';
}

export interface Project {
    id: number;
    slug: string;
    name: string;
    location: string;
    description?: string;
    year: number | null;
    status: 'en_proceso' | 'entregado';

    service_type: string | null;
    levels: string | null;
    area: string | null;

    is_featured: boolean;
    sort_order: number;
    extra_info: Record<string, any> | null;

    categories: CategoryShort[];
    related_projects: ProjectCard[];

    cover_image_url: string | null;
    banner_image_url: string | null;

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