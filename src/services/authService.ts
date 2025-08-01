import { axiosInstance } from '../lib/axios';

export interface LoginResponse {
  message: string;
  company: string;
  company_color: string;
  company_bg_color: string;
  company_text_color: string;
  company_logo: string;
}

export interface UserResponse {
  company: string;
  email: string;
  role: string;
  company_admin: boolean;
  company_name: string;
  logged_in: boolean;
  company_bg_color: string;
  company_text_color: string;
  company_logo: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ErrorLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  method: string;
  endpoint: string;
  data: string;
  error_code: number;
  error_message: string;
  created_at: string;
}

export interface ErrorLogsResponse {
  logs: ErrorLog[];
}

export interface ModifyUserSettingsResponse {
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
  getErrorLogs: async (): Promise<ErrorLogsResponse> => {
    const response = await axiosInstance.get('/dev/error-logs');
    return response.data;
  },
  clearErrorLogs: async (): Promise<ErrorLogsResponse> => {
    const response = await axiosInstance.delete('/dev/error-logs');
    return response.data;
  },

  modifyUserSettings: async (dnsPrefix: string, name?: string, newPassword?: string): Promise<ModifyUserSettingsResponse> => {
    const response = await axiosInstance.put(`/${dnsPrefix}/user/profile/settings/modify`, {
      name,
      new_password: newPassword
    });
    return response.data;
  },
};