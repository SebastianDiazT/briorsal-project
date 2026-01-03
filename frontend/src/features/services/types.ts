export interface Service {
    id: number;
    name: string;
    description: string;
    image: string | null;
}

export interface ServiceResponse {
    status: string;
    code: number;
    message: string;
    data: Service[];
    meta: {
        page: number;
        total_pages: number;
        total_records: number;
    };
}

export interface GetServicesArgs {
    page?: number;
    pageSize?: number;
    search?: string;
    no_page?: boolean;
}