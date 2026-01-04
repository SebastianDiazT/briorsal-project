export interface ContactMessageRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}

export interface ContactMessage {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    is_read: boolean;
    created_at: string;
}
