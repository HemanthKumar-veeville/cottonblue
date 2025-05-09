import { axiosInstance } from '../lib/axios';

export interface LoginResponse {
  message: string;
  company: string;
  company_color: string;
  company_logo: string;
}

export interface UserResponse {
  company: string;
  email: string;
  role: string;
  // Add other user fields as needed
}

export const authService = {
  loginPage: async (company: string): Promise<LoginResponse> => {
    const response = await axiosInstance.get(`/${company}/login`);
    return response.data;
  },
  login: async (email: string, password: string, company: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post(`/${company.toLowerCase()}/login`, {
        "email":email,
        "password":password
    });
    return response.data;
  },
  logout: async (company: string): Promise<void> => {
    const response = await axiosInstance.post(`/${company.toLowerCase()}/logout`);
    return response.data;
  },
  getUser: async (company: string): Promise<UserResponse> => {
    const response = await axiosInstance.get(`/${company.toLowerCase()}/`);
    return response.data;
  },
};