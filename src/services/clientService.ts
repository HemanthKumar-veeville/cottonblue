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
  bg_color_code: string;
  text_color_code: string;
  dns_prefix: string;
  Admin_email: string;
  Admin_first_name: string;
  Admin_last_name: string;
  Admin_mobile: string;
  email: string;
}

// Interface for carousel creation data
export interface CarouselCreationData {
  carousel_images: File[];
  is_active: boolean;
  auto_play: boolean;
}

// Interface for carousel update data
export interface CarouselUpdateData {
  carousel_image?: File;
  is_active?: boolean;
  auto_play?: boolean;
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
    formData.append('bg_color_code', data.bg_color_code);
    formData.append('text_color_code', data.text_color_code);
    formData.append('dns_prefix', data.dns_prefix);
    formData.append('Admin_email', data.Admin_email);
    formData.append('Admin_fname', data.Admin_first_name);
    formData.append('Admin_lname', data.Admin_last_name);
    formData.append('Admin_mobile', data.Admin_mobile);
    formData.append('email', data.email);
    

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

  /**
   * Get carousel data for a company by DNS prefix
   * @param dns_prefix DNS prefix of the company
   * @returns Promise with carousel data
   */
  getCarousel: async (dns_prefix: string) => {
    return axiosInstance.get(`/${dns_prefix}/carousel`);
  },

  /**
   * Create a new carousel for a company
   * @param dns_prefix DNS prefix of the company
   * @param data Carousel creation data including images and settings
   * @returns Promise with creation response
   */
  createCarousel: async (dns_prefix: string, data: CarouselCreationData) => {
    const formData = new FormData();
    
    // Append each carousel image to the FormData
    data.carousel_images.forEach((image, index) => {
      formData.append(`carousel_images`, image);
    });
    
    // Add boolean settings
    formData.append('is_active', String(data.is_active));
    formData.append('auto_play', String(data.auto_play));

    return axiosInstance.post(`/${dns_prefix}/create/carousel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete a specific carousel image by ID
   * @param dns_prefix DNS prefix of the company
   * @param image_id ID of the carousel image to delete
   * @returns Promise with deletion response
   */
  deleteCarouselImage: async (dns_prefix: string, image_id: string) => {
    return axiosInstance.delete(`/${dns_prefix}/carousel/delete/${image_id}`);
  },

  /**
   * Update carousel settings or image
   * @param dns_prefix DNS prefix of the company
   * @param data Update data containing either image file or boolean settings
   * @returns Promise with update response
   */
  updateCarousel: async (dns_prefix: string, data: CarouselUpdateData) => {
    // If updating an image
    if (data.carousel_image) {
      const formData = new FormData();
      formData.append('carousel_image', data.carousel_image);
      
      return axiosInstance.put(`/${dns_prefix}/carousel/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    // If updating settings
    const params = new URLSearchParams();
    if (typeof data.is_active === 'boolean') {
      params.append('is_active', String(data.is_active));
    }
    if (typeof data.auto_play === 'boolean') {
      params.append('auto_play', String(data.auto_play));
    }
    
    return axiosInstance.put(`/${dns_prefix}/carousel/update?${params.toString()}`);
  },
};
