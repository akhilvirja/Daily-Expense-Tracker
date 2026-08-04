import type { ApiResponse } from '../types';
import axiosInstance from './axiosInstance';

export interface DashboardData {
  totalBalance: number;
  monthlyCredit: number;
  monthlyDebit: number;
  pendingBills: {
    count: number;
    totalAmount: number;
  };
  monthlyTrend: {
    month: string;
    income: number;
    expense: number;
  }[];
  expenseByCategory: {
    name: string;
    amount: number;
  }[];
}

export const dashboardApi = {
  getData: async (): Promise<DashboardData> => {
    const { data } = await axiosInstance.get<ApiResponse<DashboardData>>('/dashboard');
    return data.data;
  },
};
