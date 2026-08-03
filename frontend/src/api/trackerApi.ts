import axiosInstance from './axiosInstance';

export interface TrackerItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  isActive: boolean;
}

export interface TrackerLog {
  id: string;
  quantity: number;
  amount: number;
  note: string | null;
}

export interface TrackerItemWithLog {
  itemId: string;
  name: string;
  unit: string;
  price: number;
  log: TrackerLog | null;
}

export const trackerApi = {
  // Items Master
  getItems: async (): Promise<TrackerItem[]> => {
    const response = await axiosInstance.get('/trackers/items');
    return response.data.data;
  },
  
  createItem: async (data: Omit<TrackerItem, 'id' | 'isActive'>): Promise<TrackerItem> => {
    const response = await axiosInstance.post('/trackers/items', data);
    return response.data.data;
  },
  
  updateItem: async (id: string, data: Partial<TrackerItem>): Promise<TrackerItem> => {
    const response = await axiosInstance.put(`/trackers/items/${id}`, data);
    return response.data.data;
  },
  
  deleteItem: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/trackers/items/${id}`);
  },

  // Daily Logs
  getLogsByDate: async (date: string): Promise<TrackerItemWithLog[]> => {
    const response = await axiosInstance.get(`/trackers/logs?date=${date}`);
    return response.data.data;
  },

  upsertLog: async (data: {
    itemId: string;
    logDate: string;
    quantity: number;
    amount: number;
    note?: string;
  }): Promise<TrackerLog> => {
    const response = await axiosInstance.post('/trackers/logs', data);
    return response.data.data;
  },

  getRecentLogs: async (itemId: string): Promise<TrackerLog[]> => {
    const response = await axiosInstance.get(`/trackers/logs/item/${itemId}`);
    return response.data.data;
  }
};
