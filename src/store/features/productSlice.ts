import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService, CreateProductData } from '../../services/productService.ts';

// Define types for the product state
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: string;
  company_id: number;
  product_image: string;
  description: string;
  available_region: string;
  is_active: boolean;
  updated_at: string;
}

interface ProductState {
  products: {
    products: Product[];
  };
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
}

// Initial state
const initialState: ProductState = {
  products: {
    products: []
  },
  loading: false,
  error: null,
  createSuccess: false,
};

// Create async thunks for API calls
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async ({ dnsPrefix, data }: { dnsPrefix: string; data: CreateProductData }, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(dnsPrefix, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (dnsPrefix: string, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(dnsPrefix);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Create the product slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create product cases
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.createSuccess = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.createSuccess = false;
      })
      // Fetch all products cases
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = productSlice.actions;
export default productSlice.reducer;
export type { Product, ProductState };
