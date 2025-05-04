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

interface ConvertCartToOrderResponse {
  success: boolean;
  message: string;
  order_id: string;
}

interface GetAllOrdersResponse {
  success: boolean;
  orders: Array<{
    id: string;
    date: string;
    price: string;
    status: {
      text: string;
      type: 'success' | 'warning' | 'danger' | 'default';
    };
    hasInvoice: boolean;
  }>;
}

interface GetOrderResponse {
  success: boolean;
  order: {
    id: string;
    date: string;
    price: string;
    status: {
      text: string;
      type: 'success' | 'warning' | 'danger' | 'default';
    };
    hasInvoice: boolean;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  };
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

  /**
   * Convert a cart to an order
   * @param dns_prefix DNS prefix of the company
   * @param store_id ID of the store
   * @param cart_id ID of the cart to convert
   * @returns Promise with order creation response
   */
  convertCartToOrder: async (
    dns_prefix: string,
    store_id: string,
    cart_id: string
  ): Promise<ConvertCartToOrderResponse> => {
    return axiosInstance.post(`/${dns_prefix}/convert-cart-to-order/${store_id}/${cart_id}`);
  },

  /**
   * Get all orders for a store
   * @param dns_prefix DNS prefix of the company
   * @param store_id ID of the store
   * @returns Promise with list of orders
   */
  getAllOrders: async (
    dns_prefix: string,
    store_id: string
  ): Promise<GetAllOrdersResponse> => {
    return axiosInstance.get(`/${dns_prefix}/all/orders/${store_id}`);
  },

  /**
   * Get a specific order by ID
   * @param dns_prefix DNS prefix of the company
   * @param store_id ID of the store
   * @param order_id ID of the order to fetch
   * @returns Promise with order details
   */
  getOrder: async (
    dns_prefix: string,
    store_id: string,
    order_id: string
  ): Promise<GetOrderResponse> => {
    return axiosInstance.get(`/${dns_prefix}/order/${store_id}/${order_id}`);
  },
};