import { axiosInstance } from '../lib/axios';

export interface LoginResponse {
  message: string;
  company: string;
  company_color: string;
  company_logo: string;
}

export const authService = {
  loginPage: async (company: string): Promise<LoginResponse> => {
    const response = await axiosInstance.get(`/${company}/login`);
    return response.data;
  },
  login: async (email: string, password: string, company: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post(`/${company}/login`, {
        "email":email,
        "password":password
    });
    return response.data;
  },

};