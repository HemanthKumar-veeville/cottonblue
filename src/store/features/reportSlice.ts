import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';

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

interface ReportState {
  orders: Order[];
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

// Initial state
const initialState: ReportState = {
  orders: [],
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
      });
  },
});

export const { clearOrders, clearError } = reportSlice.actions;
export default reportSlice.reducer;
