export interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    is_staff: boolean;
    is_superuser: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface ResetPasswordConfirmRequest {
    uid: string;
    token: string;
    new_password: string;
    re_new_password: string;
}

export interface SetPasswordRequest {
    new_password: string;
    re_new_password: string;
    current_password: string;
}

export interface UpdateUserRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
}