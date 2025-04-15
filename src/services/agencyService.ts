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
  }
};