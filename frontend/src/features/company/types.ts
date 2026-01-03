export interface CompanyInfo {
    id: number;
    phone: string;
    email: string;
    address: string;
    google_maps_url: string;
    google_maps_link: string;
    opening_hours: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
    whatsapp: string;
}

export interface CompanyResponse {
    status: string;
    code: number;
    message: string;
    data: CompanyInfo;
    meta: any;
}

export interface AboutUs {
    id: number;
    description: string;
    mission: string;
    vision: string;
    image: string | null;
}

export interface AboutUsResponse {
    status: string;
    code: number;
    message: string;
    data: AboutUs;
    meta: any;
}