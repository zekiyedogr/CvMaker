import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred.';

        window.dispatchEvent(
            new CustomEvent('api-error', {
                detail: message,
            })
        );

        return Promise.reject(error);
    }
);

export default api;