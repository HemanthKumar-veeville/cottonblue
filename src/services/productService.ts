import { axiosInstance } from '../lib/axios';

export interface CreateProductData {
  company_id: string;
  product_image?: File;
  product_images?: File[];
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
  product_image?: File;
  product_images?: File[];
  pack_of?: number;
  pack_price?: number;
  total_packs?: number;
  suitable_for?: string;
  size?: string;
  reference?: string;
}

export interface ProductVariant {
  product_id: number;
  size: string;
  price_of_pack: number;
  total_packs: number;
}

export interface AddProductVariantsRequest {
  product_variants: ProductVariant[];
}

// Add new type aliases to accept FormData
export type CreateProductPayload = CreateProductData | FormData;
export type UpdateProductPayload = UpdateProductData | FormData;

export const productService = {
  /**
   * Create a new product
   * @param dnsPrefix DNS prefix of the company
   * @param data Product creation data
   * @returns Promise with creation response
   */
  createProduct: async (dnsPrefix: string, data: CreateProductPayload) => {
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
   * @param page Page number (1-based)
   * @param limit Number of items per page
   * @returns Promise with products data
   */
  getAllProducts: async (dnsPrefix: string, page: number = 1, limit: number = 1000, searchQuery: string = "") => {
    return axiosInstance.get(`/${dnsPrefix}/all/products`, {
      params: {
        page,
        limit,
        search: searchQuery
      }
    });
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
  updateProduct: async (dnsPrefix: string, productId: string, data: UpdateProductPayload) => {
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

  /**
   * Link multiple products together
   * @param dnsPrefix DNS prefix of the company
   * @param productIds Array of product IDs to link
   * @returns Promise with linking response
   */
  linkProducts: async (dnsPrefix: string, productIds: string[]) => {
    const formData = new FormData();
    formData.append('product_ids', JSON.stringify(productIds));

    return axiosInstance.post(`/${dnsPrefix}/link/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Add variants to a product
   * @param dnsPrefix DNS prefix of the company
   * @param productId ID of the parent product
   * @param data Product variants data
   * @returns Promise with variant addition response
   */
  addProductVariants: async (dnsPrefix: string, productId: string, data: AddProductVariantsRequest) => {
    return axiosInstance.post(`/${dnsPrefix}/add/product/${productId}/variants`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Allocate multiple products to multiple stores
   * @param dnsPrefix DNS prefix of the company
   * @param storeIds Array of store IDs to allocate the products to
   * @param productIds Array of product IDs to allocate
   * @returns Promise with multi-allocation response
   */
  allocateMultipleProductsToStores: async (dnsPrefix: string, storeIds: string[], productIds: string[]) => {
    const formData = new FormData();
    storeIds?.length > 0 &&formData.append('store_ids', JSON.stringify(storeIds));
    formData.append('product_ids', JSON.stringify(productIds));

    return axiosInstance.post(`/${dnsPrefix}/stores/multi-allocation/for/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Add quantity to a specific product
   * @param dnsPrefix DNS prefix of the company
   * @param productId ID of the product to update quantity
   * @param quantity Amount to add to the product's quantity
   * @returns Promise with quantity update response
   */
  addProductQuantity: async (dnsPrefix: string, productId: string, quantity: number) => {
    return axiosInstance.post(`/${dnsPrefix}/add-product-quantity/${productId}/${quantity}`);
  },

  /**
   * Allocate multiple products to a single store
   * @param dnsPrefix DNS prefix of the company
   * @param storeId ID of the store to allocate products to
   * @param productIds Array of product IDs to allocate
   * @returns Promise with allocation response
   */
  allocateProductsToStore: async (dnsPrefix: string, storeId: string, productIds: string[]) => {
    const formData = new FormData();
    formData.append('product_ids', JSON.stringify(productIds));

    return axiosInstance.post(`/${dnsPrefix}/products/multi-allocation/for/store/${storeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
