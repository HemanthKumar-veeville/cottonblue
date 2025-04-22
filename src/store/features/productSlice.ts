import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService, CreateProductData, UpdateProductData } from '../../services/productService.ts';

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
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
}

// Initial state
const initialState: ProductState = {
  products: {
    products: []
  },
  currentProduct: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
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

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async ({ dnsPrefix, productId }: { dnsPrefix: string; productId: string }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(dnsPrefix, productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ dnsPrefix, productId, data }: { dnsPrefix: string; productId: string; data: UpdateProductData | FormData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(dnsPrefix, productId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
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
      state.updateSuccess = false;
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
      })
      // Get product by ID cases
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update product cases
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const { resetState } = productSlice.actions;
export default productSlice.reducer;
export type { Product, ProductState };
