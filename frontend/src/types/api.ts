export interface ApiResponse<T> {
    status: 'success' | 'error';
    code: number;
    message: string;
    data: T;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    current_page: number;
    total_pages: number;
    total_records: number;
    page_size: number;
    next: string | null;
    previous: string | null;
    paginated: boolean;
}

export interface ApiError {
    status: 'error';
    code: number;
    message: string;
    errors?: Record<string, string[]>;
}
