export interface Client {
    id: number;
    name: string;
    image: string;
    created_at: string;
}

export interface ClientFormData {
    name: string;
    image: File | null;
}
