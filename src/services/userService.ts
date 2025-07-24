import { axiosInstance } from '../lib/axios';

export interface UserRegistrationData {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  store_ids: number[];
  phone: string;
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  search?: string;
}

export interface UserModificationData {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  store_ids?: number[];
  role?: string;
  is_active?: boolean;
  phone?: string;
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
      formData.append('phone_number', data.phone);
      if (data.password) {
        formData.append('password', data.password);
      }
      
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
  },

  /**
   * Get user details by ID
   * @param dnsPrefix DNS prefix of the company
   * @param userId User ID to fetch details for
   * @returns Promise with user details response
   */
  getUserDetails: async (dnsPrefix: string, userId: string | number) => {
    try {
      const response = await axiosInstance.get(`/${dnsPrefix}/user/${userId}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Modify existing user data
   * @param dnsPrefix DNS prefix of the company
   * @param userId User ID to modify
   * @param data User modification data (at least one field required)
   * @returns Promise with modification response
   */
  modifyUser: async (dnsPrefix: string, userId: string | number, data: UserModificationData) => {
    try {

      // Validate that at least one field is provided
      if (Object.keys(data).length === 0) {
        throw new Error('At least one field must be provided for modification');
      }
     
      const formData = new FormData();
      
      // Only append fields that are provided
      if (data.firstname) formData.append('firstname', data.firstname);
      if (data.lastname) formData.append('lastname', data.lastname);
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone_number', data.phone);
      if (data.password) formData.append('password', data.password);
      if (data.role) formData.append('role', data.role);
      if (data.store_ids) formData.append('store_ids', JSON.stringify(data.store_ids));
      if (typeof data.is_active === 'boolean') formData.append('is_active', data.is_active.toString());

      const response = await axiosInstance.put(`/${dnsPrefix}/user/${userId}/modify`, formData, {
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
   * Delete a user by ID
   * @param dnsPrefix DNS prefix of the company
   * @param userId User ID to delete
   * @returns Promise with deletion response
   */
  deleteUser: async (dnsPrefix: string, userId: string | number) => {
    try {
      const response = await axiosInstance.delete(`/${dnsPrefix}/user/${userId}/delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};