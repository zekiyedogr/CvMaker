import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import api from '../services/api';

interface User {
    Id: number;
    FirstName: string;
    LastName: string;
    Email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    register: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;

            try {
                const response = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` }});

                setUser(response.data.data);
            }
            catch(error) {
                console.error('User authentication failed:', error);

                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        };

    fetchUser();
    }, [token]);

    const isAuthenticated = !!token;

    const setSession = (user: User, token: string) => {
        localStorage.setItem('token', token);
        setUser(user);
        setToken(token);
    };

    const login = (user: User, token: string) => {
        setSession(user, token);
    };

    const register = (user: User, token: string) => {
        setSession(user, token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};
