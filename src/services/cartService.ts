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

interface GetAllCompanyOrdersResponse {
  success: boolean;
  orders: Array<{
    id: string;
    store_id: string;
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

interface GetOrdersForApprovalResponse {
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
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  }>;
}

interface ApproveOrderResponse {
  success: boolean;
  message: string;
  order_id: string;
}

interface RefuseOrderResponse {
  success: boolean;
  message: string;
  order_id: string;
}

interface ChangeOrderStatusResponse {
  success: boolean;
  message: string;
  updated_orders: string[];
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
    cart_id: string,
    comments: string
  ): Promise<ConvertCartToOrderResponse> => {
    const formData = new FormData();
    formData.append('comments', comments);
    return axiosInstance.post(`/${dns_prefix}/convert-cart-to-order/${store_id}/${cart_id}`, formData);
  },

  /**
   * Get all orders for a store
   * @param dns_prefix DNS prefix of the company
   * @param store_id ID of the store
   * @returns Promise with list of orders
   */
  getAllOrders: async (
    dns_prefix: string,
    store_id: string,
    status: string,
    page: number,
    limit: number,
    search: string
  ): Promise<GetAllOrdersResponse> => {
    const queryParams = status ? `?status=${status}&page=${page}&limit=${limit}&search=${search}` : `?page=${page}&limit=${limit}&search=${search}`;
    return axiosInstance.get(`/${dns_prefix}/all/orders/${store_id}${queryParams}`);
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

  /**
   * Get all orders pending approval
   * @param dns_prefix DNS prefix of the company
   * @returns Promise with list of orders pending approval
   */
  getOrdersForApproval: async (
    dns_prefix: string
  ): Promise<GetOrdersForApprovalResponse> => {
    return axiosInstance.get(`/${dns_prefix}/orders-for-approval`);
  },

  /**
   * Approve a specific order
   * @param dns_prefix DNS prefix of the company
   * @param order_id ID of the order to approve
   * @returns Promise with order approval response
   */
  approveOrder: async (
    dns_prefix: string,
    order_id: string
  ): Promise<ApproveOrderResponse> => {
    return axiosInstance.post(`/${dns_prefix}/approve-order/${order_id}`);
  },

  /**
   * Refuse a specific order
   * @param dns_prefix DNS prefix of the company
   * @param order_id ID of the order to refuse
   * @returns Promise with order refusal response
   */
  refuseOrder: async (
    dns_prefix: string,
    order_id: string
  ): Promise<RefuseOrderResponse> => {
    return axiosInstance.post(`/${dns_prefix}/refuse-order/${order_id}`);
  },

  /**
   * Get all orders for a company across all stores
   * @param dns_prefix DNS prefix of the company
   * @param status Optional status filter
   * @returns Promise with list of all company orders
   */
  getAllCompanyOrders: async (
    dns_prefix: string,
    status?: string,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<GetAllCompanyOrdersResponse> => {
    const queryParams = status ? `?status=${status}&page=${page}&limit=${limit}&search=${search}` : `?page=${page}&limit=${limit}&search=${search}`;
    return axiosInstance.get(`/${dns_prefix}/all/orders${queryParams}`);
  },

  /**
   * Change the status of multiple orders
   * @param dns_prefix DNS prefix of the company
   * @param status New status to set for the orders
   * @param order_ids Array of order IDs to update
   * @returns Promise with status update response
   */
  changeOrderStatus: async (
    dns_prefix: string,
    status: string,
    order_ids: string[]
  ): Promise<ChangeOrderStatusResponse> => {
    return axiosInstance.post(
      `/${dns_prefix}/change-order-status/${status}`,
      { order_ids }
    );
  },
};