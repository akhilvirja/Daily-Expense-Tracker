import type { ApiResponse, PaginatedResponse, Transaction, CreateTransactionPayload, UpdateTransactionPayload, TransferPayload } from '../types';
import axiosInstance from './axiosInstance';

export const transactionApi = {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<Transaction>> => {
        const { data } = await axiosInstance.get<PaginatedResponse<Transaction>>('/transactions', { params });
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

    transfer: async (payload: TransferPayload): Promise<ApiResponse<Transaction[]>> => {
        const { data } = await axiosInstance.post<ApiResponse<Transaction[]>>('/transactions/transfer', payload);
        return data;
    },
};
