export type InquiryType =
    | 'GENERAL'
    | 'QUOTE'
    | 'PROJECT'
    | 'SUPPLIER'
    | 'OTHER';

export type ContactStatus = 'NEW' | 'IN_PROGRESS' | 'REPLIED' | 'SPAM';

export interface ContactMessageRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    inquiry_type: InquiryType;
}

export interface ContactMessage {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone?: string;

    subject?: string;
    message: string;
    inquiry_type: InquiryType;

    status: ContactStatus;
    admin_notes?: string;

    created_at: string;
    updated_at: string;
}

export const STATUS_COLORS: Record<ContactStatus, string> = {
    NEW: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    REPLIED: 'bg-gray-100 text-gray-800',
    SPAM: 'bg-red-100 text-red-800',
};

export const STATUS_LABELS: Record<ContactStatus, string> = {
    NEW: 'Nuevo',
    IN_PROGRESS: 'En Seguimiento',
    REPLIED: 'Respondido',
    SPAM: 'Spam',
};

export const INQUIRY_LABELS: Record<InquiryType, string> = {
    GENERAL: 'Consulta General',
    QUOTE: 'Solicitud de Presupuesto',
    PROJECT: 'Información de Proyecto',
    SUPPLIER: 'Propuesta de Proveedor',
    OTHER: 'Otro',
};
