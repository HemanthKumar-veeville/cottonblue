import { axiosInstance } from '../lib/axios';

interface RegisterStoreData {
  company_id: string;
  store_name: string;
  store_address: string;
  city: string;
  postal_code: string;
  phone_number?: string;
  latitude?: number;
  longitude?: number;
}

export const agencyService = {
  registerStore: async (dnsPrefix: string, data: RegisterStoreData) => {
    try {
      const response = await axiosInstance.post(`/${dnsPrefix}/store/register`, data);
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