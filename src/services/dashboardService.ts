import { axiosInstance } from '../lib/axios';

export const dashboardService = {
  /**
   * Get dashboard data for a company
   * @param dns_prefix DNS prefix of the company
   * @returns Promise with dashboard data including stats, top products, top clients, and recent tickets
   */
  getDashboard: async (dns_prefix: string, filter_by: string, filter_value: string) => {
    const response = await axiosInstance.get(
      `/${dns_prefix}/dashboard?filter_by=${filter_by}&filter_value=${filter_value}`
    );
    return response.data;
  },
};
