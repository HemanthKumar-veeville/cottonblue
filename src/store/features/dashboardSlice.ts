import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/dashboardService';


interface DashboardState {
  summary: object | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DashboardState = {
  summary: null,
  loading: false,
  error: null,
};

// Create async thunk for fetching dashboard data
export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  async ({ dns_prefix, filter_by, filter_value }: { dns_prefix: string, filter_by: string, filter_value: string }, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboard(
        dns_prefix,
        filter_by,
        filter_value
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

// Create the dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {   
      state.error = null;
    },
    resetDashboard: (state) => {
      state.summary = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer; 