import type { PaginatedResponse, PaginationMeta } from '../types';
import axiosInstance from './axiosInstance';
import type { TrackerItem } from './trackerApi';

export interface Bill {
  id: string;
  itemId: string;
  periodStart: string;
  periodEnd: string;
  totalQuantity: number;
  totalAmount: number;
  status: 'pending' | 'paid';
  paidAccountId: string | null;
  paidOn: string | null;
  item: { name: string; unit: string };
  paidAccount?: { name: string };
  createdAt: string;
}

export const billApi = {
  getBills: async (params?: { page?: number; limit?: number; status?: string }): Promise<{ data: Bill[]; pagination: PaginationMeta }> => {
    const response = await axiosInstance.get<PaginatedResponse<Bill>>('/bills', { params });
    return {
      data: response.data.data || [],
      pagination: response.data.pagination,
    };
  },
  
  generateBill: async (data: { itemId: string; periodStart: string; periodEnd: string }): Promise<Bill> => {
    const response = await axiosInstance.post('/bills/generate', data);
    return response.data.data;
  },
  
  payBill: async (id: string, data: { accountId: string; paidOn: string; remarks?: string }): Promise<Bill> => {
    const response = await axiosInstance.put(`/bills/${id}/pay`, data);
    return response.data.data;
  },
  
  undoPayment: async (id: string): Promise<Bill> => {
    const response = await axiosInstance.put(`/bills/${id}/undo`);
    return response.data.data;
  }
};
