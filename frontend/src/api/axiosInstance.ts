import axios from 'axios';

/**
 * Axios instance pre-configured with:
 * - Base URL from environment variable
 * - JSON content type headers
 * - Response interceptor for error handling
 */
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Response interceptor — extract data or throw meaningful errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extract the API error message if available
        const message =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred';

        const apiError = {
            message,
            status: error.response?.status,
            errors: error.response?.data?.errors || null,
        };

        return Promise.reject(apiError);
    }
);

export default axiosInstance;
