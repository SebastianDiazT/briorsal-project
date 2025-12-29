export interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    is_staff: boolean;
}

export interface Service {
    id: number;
    title: string;
    icon: string;
    description: string;
}
