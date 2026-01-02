export interface ApiResponse<T> {
    status: 'success' | 'error';
    code: number;
    message: string;
    data: T;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    total_pages: number;
    total_records: number;
    next: string | null;
    previous: string | null;
}

export interface ApiError {
    status: 'error';
    code: number;
    message: string;
    errors?: Record<string, string[]>;
}
