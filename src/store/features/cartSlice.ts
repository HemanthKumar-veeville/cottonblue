import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from './productSlice';
import { cartService } from '../../services/cartService';

interface CartItem extends Product {
  quantity: number;
  product_id?: number;
  cart_id: string;
}

interface Order {
  id: string;
  date: string;
  price: string;
  status: {
    text: string;
    type: 'success' | 'warning' | 'danger' | 'default';
  };
  hasInvoice: boolean;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  loading: boolean;
  error: string | null;
  total: number;
  orders: Order[];
  currentOrderId: string | null;
}

// Async thunk actions
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ dns_prefix, store_id }: { dns_prefix: string; store_id: string }) => {
    const response = await cartService.getCart(dns_prefix, store_id);
    return response?.data;
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
    return response;
  }
);

export const convertCartToOrder = createAsyncThunk(
  'cart/convertCartToOrder',
  async ({ 
    dns_prefix, 
    store_id, 
    cart_id 
  }: { 
    dns_prefix: string; 
    store_id: string; 
    cart_id: string;
  }) => {
    const response = await cartService.convertCartToOrder(dns_prefix, store_id, cart_id);
    return response;
  }
);

export const getAllOrders = createAsyncThunk(
  'cart/getAllOrders',
  async ({ 
    dns_prefix, 
    store_id 
  }: { 
    dns_prefix: string; 
    store_id: string;
  }) => {
    const response = await cartService.getAllOrders(dns_prefix, store_id);
    return response;
  }
);

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  orders: [],
  currentOrderId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product_id === product.id);

      if (existingItem) {
        // Check if we have enough stock
        if (product.available_stock >= existingItem.quantity + quantity) {
          existingItem.quantity += quantity;
          // Remove item if quantity becomes 0
          if (existingItem.quantity <= 0) {
            state.items = state.items.filter(item => item.product_id !== product.id);
          }
        } else {
          state.error = 'Not enough stock available';
        }
      } else if (quantity > 0) { // Only add new items if quantity is positive
        // Check if we have enough stock for new item
        if (product.available_stock >= quantity) {
          state.items.push({ ...product, quantity, product_id: product.id });
        } else {
          state.error = 'Not enough stock available';
        }
      }

      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product_id !== action.payload);
      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product_id === productId);

      if (item) {
        // Find the product in the store to check stock
        if (item.available_stock >= quantity) {
          item.quantity = quantity;
        } else {
          state.error = 'Not enough stock available';
        }
      }

      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
    // Handle fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure each item has product_id set
        state.items = action.payload.products;
        state.cartId = action.payload.cart_id;
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })

    // Handle addToCartAsync
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.cart_items) {
          // Ensure each item has product_id set
          state.items = action.payload.cart_items.map((item: CartItem) => ({
            ...item,
            product_id: item.id
          }));
          state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      });

    // Handle convertCartToOrder
    builder
      .addCase(convertCartToOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(convertCartToOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrderId = action.payload.order_id;
        // Clear the cart after successful conversion
        state.items = [];
        state.total = 0;
      })
      .addCase(convertCartToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to convert cart to order';
      })

    // Handle getAllOrders
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