import axiosInstance from './axiosInstance';
import type { ApiResponse, AuthResponse } from '../types';

export const authApi = {
    register: async (data: any): Promise<ApiResponse<AuthResponse>> => {
        const response = await axiosInstance.post('/auth/register', data);
        return response.data;
    },

    login: async (data: any): Promise<ApiResponse<AuthResponse>> => {
        const response = await axiosInstance.post('/auth/login', data);
        return response.data;
    },

    getMe: async (): Promise<ApiResponse<{ id: string; fullName: string; email: string }>> => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    },
};
