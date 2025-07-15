import { axiosInstance } from '../lib/axios';

export const agencyService = {
  registerStore: async (dnsPrefix: string, data: FormData) => {
    try {
      const response = await axiosInstance.post(`/${dnsPrefix}/store/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllStores: async (dnsPrefix: string) => {
    try {
      const response = await axiosInstance.get(`/${dnsPrefix}/get_all_stores`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStoreDetails: async (dnsPrefix: string, storeId: string) => {
    try {
      const response = await axiosInstance.get(`/${dnsPrefix}/store/${storeId}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  modifyStore: async (dnsPrefix: string, storeId: string, data: FormData) => {
    try {
      const response = await axiosInstance.put(`/${dnsPrefix}/store/${storeId}/modify`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteStore: async (dnsPrefix: string, storeId: string) => {
    try {
      const response = await axiosInstance.delete(`/${dnsPrefix}/store/${storeId}/delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStoreBudget: async (dnsPrefix: string, storeId: string) => {
    try {
      const response = await axiosInstance.get(`/${dnsPrefix}/store_budget/${storeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};