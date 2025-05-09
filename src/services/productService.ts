import { axiosInstance } from '../lib/axios';

export interface CreateProductData {
  company_id: string;
  product_image: File;
  product_name: string;
  product_description?: string;
  product_price?: number;
  available_region?: string;
  pack_of: number;
  pack_price: number;
  total_packs: number;
  product_id?: string;
  reference?: string;
}

export interface UpdateProductData {
  product_name?: string;
  product_description?: string;
  product_price?: number;
  available_region?: string;
  pack_of?: number;
  pack_price?: number;
  total_packs?: number;
  product_image?: File;
  is_active?: boolean;
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
    console.log({data})
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

  /**
   * Get a single product by ID
   * @param dnsPrefix DNS prefix of the company
   * @param productId ID of the product to retrieve
   * @returns Promise with product data
   */
  getProductById: async (dnsPrefix: string, productId: string) => {
    return axiosInstance.get(`/${dnsPrefix}/product/${productId}`);
  },

  /**
   * Update an existing product
   * @param dnsPrefix DNS prefix of the company
   * @param productId ID of the product to update
   * @param data Product update data
   * @returns Promise with update response
   */
  updateProduct: async (dnsPrefix: string, productId: string, data: UpdateProductData | FormData) => {
    // If data is already FormData, use it directly
    const formData = data instanceof FormData ? data : new FormData();
    
    // Only convert to FormData if the input is not already FormData
    if (!(data instanceof FormData)) {
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined) {
          formData.append(key, value);
        }
      });
    }

    return axiosInstance.put(`/${dnsPrefix}/update/product/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete a product by ID
   * @param dnsPrefix DNS prefix of the company
   * @param productId ID of the product to delete
   * @returns Promise with deletion response
   */
  deleteProduct: async (dnsPrefix: string, productId: string) => {
    return axiosInstance.delete(`/${dnsPrefix}/delete/product/${productId}`);
  },

  /**
   * Get all products for a specific store
   * @param dnsPrefix DNS prefix of the company
   * @param storeId ID of the store to get products from
   * @returns Promise with store products data
   */
  getProductsByStoreId: async (dnsPrefix: string, storeId: string) => {
    return axiosInstance.get(`/${dnsPrefix}/store/products/${storeId}`);
  },

  /**
   * Allocate a product to multiple stores
   * @param dnsPrefix DNS prefix of the company
   * @param productId ID of the product to allocate
   * @param storeIds Array of store IDs to allocate the product to
   * @returns Promise with allocation response
   */
  allocateProductToStores: async (dnsPrefix: string, productId: string, storeIds: string[]) => {
    const formData = new FormData();
    formData.append('store_ids', JSON.stringify(storeIds));

    return axiosInstance.post(`/${dnsPrefix}/stores/allocation/for/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get all stores that a product has been allocated to
   * @param dnsPrefix DNS prefix of the company
   * @param productId ID of the product to get allocated stores for
   * @returns Promise with allocated stores data
   */
  getAllocatedStoresForProduct: async (dnsPrefix: string, productId: string) => {
    return axiosInstance.get(`/${dnsPrefix}/allocated-stores/product/${productId}`);
  },
};
