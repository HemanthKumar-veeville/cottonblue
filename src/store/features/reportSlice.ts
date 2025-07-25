import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';
import { productService } from '../../services/productService';

// Define interfaces
interface Order {
  id: string;
  store_id: string;
  date: string;
  price: string;
  status: {
    text: string;
    type: 'success' | 'warning' | 'danger' | 'default';
  };
  hasInvoice: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  product_image: string | null;
  category: string | null;
  pack_quantity: number;
  total_packs: number;
  available_packs: number;
  created_at: string;
  company_id: number;
  suitable_for: string;
  size: string;
  price_of_pack: number;
  is_active: boolean;
  updated_at: string;
}

interface ReportState {
  orders: Order[];
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Create async thunk
export const getAllCompanyOrdersReport = createAsyncThunk(
  'report/getAllCompanyOrders',
  async ({ 
    dns_prefix, 
    status, 
    page = 1, 
    limit = 1000, 
    search = '' 
  }: { 
    dns_prefix: string; 
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      const response = await cartService.getAllCompanyOrders(
        dns_prefix,
        status,
        page,
        limit,
        search
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async ({ dnsPrefix, page = 1, limit = 1000, searchQuery = "" }: { dnsPrefix: string; page?: number; limit?: number; searchQuery?: string }, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(dnsPrefix, page, limit, searchQuery);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Initial state
const initialState: ReportState = {
  orders: [],
  products: [],
  loading: false,
  error: null
};

// Create slice
const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCompanyOrdersReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCompanyOrdersReport.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.error = null;
      })
      .addCase(getAllCompanyOrdersReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch company orders';
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

export const { clearOrders, clearError } = reportSlice.actions;
export default reportSlice.reducer;
export type { Product, ReportState };
