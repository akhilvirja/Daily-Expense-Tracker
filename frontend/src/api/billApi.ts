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
  getBills: async (): Promise<Bill[]> => {
    const response = await axiosInstance.get('/bills');
    return response.data.data;
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
