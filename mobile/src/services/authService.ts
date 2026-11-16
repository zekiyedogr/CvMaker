import api from './api';

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    status: string;
    message: string;
    data: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    token: string;
}

export const registerUser = async (userData: RegisterData) => {
    const response = await api.post<AuthResponse>(
        '/auth/register',
        userData
    );

    return response.data;
};

export const loginUser = async (userData: LoginData) => {
    const response = await api.post<AuthResponse>(
        '/auth/login',
        userData
    );

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');

    return response.data;
};