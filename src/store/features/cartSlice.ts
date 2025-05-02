import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './productSlice';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  total: number;
}

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
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        // Check if we have enough stock
        if (product.available_stock >= existingItem.quantity + quantity) {
          existingItem.quantity += quantity;
        } else {
          state.error = 'Not enough stock available';
        }
      } else {
        // Check if we have enough stock for new item
        if (product.available_stock >= quantity) {
          state.items.push({ ...product, quantity });
        } else {
          state.error = 'Not enough stock available';
        }
      }

      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);

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
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  clearError 
} = cartSlice.actions;

export default cartSlice.reducer; 