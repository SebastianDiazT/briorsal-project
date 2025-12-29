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
    image: string;
    description: string;
}

export interface CompanyInfo {
    id: number;
    phone: string;
    email: string;
    address: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
    whatsapp: string;
}

export interface AboutUs {
    id: number;
    description: string;
    mission: string;
    vision: string;
    image: string | null;
}

export interface ClientLogo {
    id: number;
    name: string;
    image: string;
    order?: number;
}