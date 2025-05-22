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

export interface ResetPasswordResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
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
  resetPassword: async (dnsPrefix: string, userId: string, token: string, newPassword: string): Promise<ResetPasswordResponse> => {
    const response = await axiosInstance.post(`/${dnsPrefix}/reset-password/${userId}/${token}`, {
      new_password: newPassword
    });
    return response.data;
  },
  forgotPassword: async (dnsPrefix: string, email: string): Promise<ForgotPasswordResponse> => {
    const response = await axiosInstance.post(`/${dnsPrefix}/forgot-password/${email}`);
    return response.data;
  },
};