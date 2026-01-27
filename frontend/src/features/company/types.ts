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

export interface AboutUs {
    id: number;
    description: string;
    mission: string;
    vision: string;
    image: string | null;
}

export interface HomeHero {
    id: number;
    badge: string;
    title: string;
    highlight: string;
    description: string;
    image: string | null;
}

export interface ProjectsHero {
    id: number;
    title: string;
    highlight: string;
    description: string;
    image: string | null;
}