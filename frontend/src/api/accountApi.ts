import axiosInstance from './axiosInstance';
import type { Account, ApiResponse, CreateAccountPayload, UpdateAccountPayload } from '../types';

/**
 * Account API — Handles all HTTP requests for the Account module.
 * Maps to backend routes: /api/v1/accounts
 */

export const accountApi = {
    /**
     * Get all active accounts
     */
    getAll: async (): Promise<ApiResponse<Account[]>> => {
        const { data } = await axiosInstance.get('/accounts');
        return data;
    },

    /**
     * Get a single account by ID
     */
    getById: async (id: string): Promise<ApiResponse<Account>> => {
        const { data } = await axiosInstance.get(`/accounts/${id}`);
        return data;
    },

    /**
     * Create a new account
     */
    create: async (payload: CreateAccountPayload): Promise<ApiResponse<Account>> => {
        const { data } = await axiosInstance.post('/accounts', payload);
        return data;
    },

    /**
     * Update an existing account
     */
    update: async (id: string, payload: UpdateAccountPayload): Promise<ApiResponse<Account>> => {
        const { data } = await axiosInstance.put(`/accounts/${id}`, payload);
        return data;
    },

    /**
     * Soft-delete an account
     */
    delete: async (id: string): Promise<ApiResponse<null>> => {
        const { data } = await axiosInstance.delete(`/accounts/${id}`);
        return data;
    },
};
