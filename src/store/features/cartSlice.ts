import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from './productSlice';
import { cartService } from '../../services/cartService';

interface CartItem extends Product {
  quantity: number;
  product_id?: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  total: number;
}

// Async thunk actions
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ dns_prefix, store_id }: { dns_prefix: string; store_id: string }) => {
    const response = await cartService.getCart(dns_prefix, store_id);
    return response;
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

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
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
        state.items = action.payload.data.products;
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