export interface Category {
    id: number;
    name: string;
}
export interface CreateCategoryRequest {
    name: string;
}

export interface UpdateCategoryRequest {
    id: number;
    data: {
        name: string;
    };
}

export interface GetCategoriesArgs {
    page?: number;
    pageSize?: number;
    search?: string;
    no_page?: boolean;
}