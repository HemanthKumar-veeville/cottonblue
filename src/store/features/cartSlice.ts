import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from './productSlice';
import { cartService } from '../../services/cartService';

// Updated CartItem interface
export interface CartItem {
  product_id: number;
  product_name: string;
  product_image: string | null;
  price_of_pack: number;
  quantity: number;
}

interface Order {
  created_at: string;
  order_id: number;
  order_items: Array<{
    product_id: number;
    product_image: string;
    product_name: string;
    product_price: number;
    quantity: number;
  }>;
  order_status: string;
  store_address: string;
  store_name: string;
}

interface StoreDetails {
  store_id: string;
  store_name: string;
  store_address: string;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  loading: boolean;
  error: string | null;
  total: number;
  orders: Order[];
  currentOrderId: string | null;
  currentOrder: Order | null;
  ordersForApproval: Order[];
  store_details: StoreDetails | null;
}

// Updated response types
interface GetCartResponse {
  cart_id: string;
  products: CartItem[];
}

interface GetAllOrdersResponse {
  orders: Order[];
}

interface GetOrderResponse {
  order: Order;
}

interface GetAllCompanyOrdersResponse {
  orders: Array<Order & { store_id: string }>;
}

// Updated async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ dns_prefix, store_id }: { dns_prefix: string; store_id: string }) => {
    const response = await cartService.getCart(dns_prefix, store_id);
    return response.data as GetCartResponse;
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ 
    dns_prefix, 
    store_id, 
    product_id, 
    quantity 
  }: { 
    dns_prefix: string; 
    store_id: string; 
    product_id: string; 
    quantity: number 
  }) => {
    const response = await cartService.addToCart(dns_prefix, store_id, product_id, quantity);
    return response.data;
  }
);

export const convertCartToOrder = createAsyncThunk(
  'cart/convertCartToOrder',
  async ({ 
    dns_prefix, 
    store_id, 
    cart_id,
    comments
  }: { 
    dns_prefix: string; 
    store_id: string; 
    cart_id: string;
    comments: string;
  }) => {
    const response = await cartService.convertCartToOrder(dns_prefix, store_id, cart_id, comments);
    return response;
  }
);

export const getAllOrders = createAsyncThunk(
  'cart/getAllOrders',
  async ({ 
    dns_prefix, 
    store_id,
    status
  }: { 
    dns_prefix: string; 
    store_id: string;
    status?: string;
  }) => {
    const response = await cartService.getAllOrders(dns_prefix, store_id, status);
    return response.data;
  }
);

export const getOrder = createAsyncThunk(
  'cart/getOrder',
  async ({ 
    dns_prefix, 
    store_id, 
    order_id 
  }: { 
    dns_prefix: string; 
    store_id: string; 
    order_id: string;
  }) => {
    const response = await cartService.getOrder(dns_prefix, store_id, order_id);
    
    return response.data;
  }
);

export const getOrdersForApproval = createAsyncThunk(
  'cart/getOrdersForApproval',
  async ({ dns_prefix }: { dns_prefix: string }) => {
    const response = await cartService.getOrdersForApproval(dns_prefix);
    return response.data;
  }
);

export const approveOrder = createAsyncThunk(
  'cart/approveOrder',
  async ({ dns_prefix, order_id }: { dns_prefix: string; order_id: string }) => {
    const response = await cartService.approveOrder(dns_prefix, order_id);
    return response.data;
  }
);

export const refuseOrder = createAsyncThunk(
  'cart/refuseOrder',
  async ({ dns_prefix, order_id }: { dns_prefix: string; order_id: string }) => {
    const response = await cartService.refuseOrder(dns_prefix, order_id);
    return response;
  }
);

export const getAllCompanyOrders = createAsyncThunk(
  'cart/getAllCompanyOrders',
  async ({ dns_prefix, status }: { dns_prefix: string; status?: string }) => {
    const response = await cartService.getAllCompanyOrders(dns_prefix, status);
    return response.data;
  }
);

export const changeOrderStatus = createAsyncThunk(
  'cart/changeOrderStatus',
  async ({ 
    dns_prefix, 
    status, 
    order_ids 
  }: { 
    dns_prefix: string; 
    status: string; 
    order_ids: string[];
  }) => {
    const response = await cartService.changeOrderStatus(dns_prefix, status, order_ids);
    return response.data;
  }
);

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  orders: [],
  currentOrderId: null,
  currentOrder: null,
  cartId: null,
  ordersForApproval: [],
  store_details: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product.id);

      if (existingItem) {
        if (product.available_packs >= existingItem.quantity + quantity) {
          existingItem.quantity += quantity;
          if (existingItem.quantity <= 0) {
            state.items = state.items.filter(item => item.product_id !== product.id);
          }
        } else {
          state.error = 'Not enough stock available';
        }
      } else if (quantity > 0) {
        if (product.available_packs >= quantity) {
          const newItem: CartItem = {
            product_id: product.id,
            product_name: product.name,
            product_image: product.product_image,
            price_of_pack: product.price_of_pack,
            quantity
          };
          state.items.push(newItem);
        } else {
          state.error = 'Not enough stock available';
        }
      }

      state.total = state.items.reduce((sum, item) => sum + (item.price_of_pack * item.quantity), 0);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product_id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + (item.price_of_pack * item.quantity), 0);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product_id === productId);

      if (item) {
        item.quantity = quantity;
      }

      state.total = state.items.reduce((sum, item) => sum + (item.price_of_pack * item.quantity), 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.store_details = action.payload.store_details;
        state.cartId = action.payload.cart_id;
        state.total = state.items.reduce((sum, item) => sum + (item.price_of_pack * item.quantity), 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })

    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.cart_items) {
          state.items = action.payload.cart_items.map((item: CartItem) => ({
            ...item,
            product_id: item.product_id
          }));
          state.total = state.items.reduce((sum, item) => sum + (item.price_of_pack * item.quantity), 0);
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      });

    builder
      .addCase(convertCartToOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(convertCartToOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrderId = action.payload.order_id;
        state.items = [];
        state.total = 0;
      })
      .addCase(convertCartToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to convert cart to order';
      });

    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });

    builder
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order details';
      });

    builder
      .addCase(getOrdersForApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersForApproval.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersForApproval = action.payload.orders;
      })
      .addCase(getOrdersForApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders for approval';
      });

    builder
      .addCase(approveOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersForApproval = state.ordersForApproval.filter(
          order => order.id !== action.payload.order_id
        );
      })
      .addCase(approveOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to approve order';
      });

    builder
      .addCase(refuseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refuseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersForApproval = state.ordersForApproval.filter(
          order => order.order_id !== Number(action.payload.order_id)
        );
      })
      .addCase(refuseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to refuse order';
      });

    builder
      .addCase(getAllCompanyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCompanyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getAllCompanyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch company orders';
      });
    builder
      .addCase(changeOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = state.orders?.map((order) => {
          if (action.payload && action.payload.order_ids && action.payload.order_ids.includes(order.order_id)) {
            return {
              ...order,
              order_status: action.payload.order_status
            };
          }
          return order;
        });
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to change order status';
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  clearError 
} = cartSlice.actions;

export default cartSlice.reducer; 