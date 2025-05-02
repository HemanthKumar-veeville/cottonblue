import { axiosInstance } from '../lib/axios';

interface AddToCartResponse {
  success: boolean;
  message: string;
  cart_items?: any[]; // Replace with proper type once API response structure is known
}

interface GetCartResponse {
  success: boolean;
  cart_items: any[]; // Replace with proper type once API response structure is known
  total: number;
}

export const cartService = {
  /**
   * Add a product to the cart
   * @param dns_prefix DNS prefix of the company
   * @param store_id ID of the store
   * @param product_id ID of the product to add
   * @param quantity Quantity to add
   * @returns Promise with cart update response
   */
  addToCart: async (
    dns_prefix: string,
    store_id: string,
    product_id: string,
    quantity: number
  ): Promise<AddToCartResponse> => {
    return axiosInstance.post(
      `/${dns_prefix}/add-to-cart/${store_id}/${product_id}/${quantity}`
    );
  },

  /**
   * Get the current cart contents for a store
   * @param dns_prefix DNS prefix of the company
   * @param store_id ID of the store
   * @returns Promise with cart contents
   */
  getCart: async (
    dns_prefix: string,
    store_id: string
  ): Promise<GetCartResponse> => {
    return axiosInstance.get(`/${dns_prefix}/get-cart/${store_id}`);
  },
};