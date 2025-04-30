import { axiosInstance } from '../lib/axios';

export interface UserRegistrationData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  store_ids: number[];
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  search?: string;
}

export const userService = {
  /**
   * Register a new user
   * @param dnsPrefix DNS prefix of the company
   * @param data User registration data
   * @returns Promise with registration response
   */
  registerUser: async (dnsPrefix: string, data: UserRegistrationData) => {
    try {
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append('firstname', data.firstname);
      formData.append('lastname', data.lastname);
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      // Send store_ids as a JSON string to preserve array structure
      formData.append('store_ids', JSON.stringify(data.store_ids));
      
      const response = await axiosInstance.post(`/${dnsPrefix}/store/user/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetch all users with optional filtering, sorting, and pagination
   * @param dnsPrefix DNS prefix of the company
   * @param params Optional parameters for fetching users
   * @returns Promise with users list response
   */
  fetchUsers: async (dnsPrefix: string, params: FetchUsersParams = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by = '-created_at',
        search
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort_by: sort_by
      });

      if (search) {
        queryParams.append('search', search);
      }

      const response = await axiosInstance.get(
        `/${dnsPrefix}/all/users?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};