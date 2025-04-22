import { axiosInstance } from '../lib/axios';

export interface CreateProductData {
  company_id: string;
  product_image: File;
  product_name: string;
  product_description?: string;
  product_price: number;
  available_region: string;
  total_stock: number;
}

export const productService = {
  /**
   * Create a new product
   * @param dnsPrefix DNS prefix of the company
   * @param data Product creation data
   * @returns Promise with creation response
   */
  createProduct: async (dnsPrefix: string, data: CreateProductData | FormData) => {
    // If data is already FormData, use it directly
    const formData = data instanceof FormData ? data : new FormData();
    
    // Only convert to FormData if the input is not already FormData
    if (!(data instanceof FormData)) {
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
    }
    
    return axiosInstance.post(`/${dnsPrefix}/create/product`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get all products for a company
   * @param dnsPrefix DNS prefix of the company
   * @returns Promise with products data
   */
  getAllProducts: async (dnsPrefix: string) => {
    return axiosInstance.get(`/${dnsPrefix}/all/products`);
  },
};
