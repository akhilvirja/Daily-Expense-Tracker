import axiosInstance from './axiosInstance';

export interface CategoryReportData {
  name: string;
  value: number;
  isSystem: boolean;
}

export interface TrendReportData {
  name: string;
  income: number;
  expense: number;
}

export const reportApi = {
  getCategoryReport: async (startDate?: string, endDate?: string, accountId?: string, categoryId?: string, type?: string) => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (accountId) params.accountId = accountId;
    if (categoryId) params.categoryId = categoryId;
    if (type) params.type = type;
    
    const response = await axiosInstance.get('/reports/category', { params });
    return response.data;
  },

  getTrendReport: async (startDate?: string, endDate?: string, groupBy: 'day' | 'week' | 'month' = 'month', accountId?: string, categoryId?: string, type?: string) => {
    const params: any = { groupBy };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (accountId) params.accountId = accountId;
    if (categoryId) params.categoryId = categoryId;
    if (type) params.type = type;

    const response = await axiosInstance.get('/reports/trend', { params });
    return response.data;
  }
};
