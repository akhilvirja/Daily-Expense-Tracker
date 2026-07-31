import type { ApiResponse, Transaction, CreateTransactionPayload, UpdateTransactionPayload } from '../types';
import axiosInstance from './axiosInstance';

export const transactionApi = {
    getAll: async (params?: Record<string, any>): Promise<ApiResponse<Transaction[]>> => {
        const { data } = await axiosInstance.get<ApiResponse<Transaction[]>>('/transactions', { params });
        return data;
    },

    getById: async (id: string): Promise<ApiResponse<Transaction>> => {
        const { data } = await axiosInstance.get<ApiResponse<Transaction>>(`/transactions/${id}`);
        return data;
    },

    create: async (payload: CreateTransactionPayload): Promise<ApiResponse<Transaction>> => {
        const { data } = await axiosInstance.post<ApiResponse<Transaction>>('/transactions', payload);
        return data;
    },

    update: async (id: string, payload: UpdateTransactionPayload): Promise<ApiResponse<Transaction>> => {
        const { data } = await axiosInstance.patch<ApiResponse<Transaction>>(`/transactions/${id}`, payload);
        return data;
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        const { data } = await axiosInstance.delete<ApiResponse<void>>(`/transactions/${id}`);
        return data;
    },
};
