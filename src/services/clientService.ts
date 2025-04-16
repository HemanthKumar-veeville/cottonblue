import { axiosInstance } from '../lib/axios';

// Interface for client registration data
export interface ClientRegistrationData {
  company_name: string;
  company_address: string;
  city: string;
  postal_code: string;
  phone_number: string;
  logo: File;
  color_code: string;
  dns_prefix: string;
  Admin_email: string;
  Admin_password: string;
  Admin_fname?: string; // Optional, defaults to "Admin"
  Admin_lname?: string; // Optional, defaults to company_name
}

export const clientService = {
  /**
   * Register a new client with admin user
   * @param data Client registration data
   * @returns Promise with registration response
   */
  registerClient: async (data: ClientRegistrationData) => {
    // Create FormData object to handle file upload
    const formData = new FormData();
    
    // Add all required fields to FormData
    formData.append('company_name', data.company_name);
    formData.append('company_address', data.company_address);
    formData.append('city', data.city);
    formData.append('postal_code', data.postal_code);
    formData.append('phone_number', data.phone_number);
    formData.append('logo', data.logo);
    formData.append('color_code', data.color_code);
    formData.append('dns_prefix', data.dns_prefix);
    formData.append('Admin_email', data.Admin_email);
    formData.append('Admin_password', data.Admin_password);
    
    // Add optional fields with default values if not provided
    formData.append('Admin_fname', data.Admin_fname || 'Admin');
    formData.append('Admin_lname', data.Admin_lname || data.company_name);
    
    // Make API request to register client
    return axiosInstance.post(`/${data.dns_prefix}/client/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get all companies from the admin endpoint
   * @returns Promise with companies data
   */
  getAllCompanies: async () => {
    return axiosInstance.get('/admin/get_all_companies');
  },

  /**
   * Get company details by DNS prefix
   * @param dns_prefix DNS prefix of the company
   * @returns Promise with company details
   */
  getCompanyByDnsPrefix: async (dns_prefix: string) => {
    return axiosInstance.get(`/${dns_prefix}/client/details`);
  },

  /**
   * Modify company details by DNS prefix and company ID
   * @param dns_prefix DNS prefix of the company
   * @param company_id ID of the company
   * @returns Promise with modification response
   */
  modifyCompany: async (dns_prefix: string, company_id: string, data: any) => {
    // Create FormData object
    const formData = new FormData();
    
    // Add all fields from data object to FormData
    Object.entries(data).forEach(([key, value]) => {
      // Handle File objects separately to preserve them
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    return axiosInstance.put(`/${dns_prefix}/client/${company_id}/modify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
