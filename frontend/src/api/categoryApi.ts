import type { ApiResponse, Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types';
import axiosInstance from './axiosInstance';

export const categoryApi = {
    getAll: async (): Promise<ApiResponse<Category[]>> => {
        const { data } = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
        return data;
    },

    getById: async (id: string): Promise<ApiResponse<Category>> => {
        const { data } = await axiosInstance.get<ApiResponse<Category>>(`/categories/${id}`);
        return data;
    },

    create: async (payload: CreateCategoryPayload): Promise<ApiResponse<Category>> => {
        const { data } = await axiosInstance.post<ApiResponse<Category>>('/categories', payload);
        return data;
    },

    update: async (id: string, payload: UpdateCategoryPayload): Promise<ApiResponse<Category>> => {
        const { data } = await axiosInstance.patch<ApiResponse<Category>>(`/categories/${id}`, payload);
        return data;
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        const { data } = await axiosInstance.delete<ApiResponse<void>>(`/categories/${id}`);
        return data;
    },
};
