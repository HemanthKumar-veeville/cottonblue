import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { agencyService } from '../../services/agencyService';

// Define the Agency interface
interface Agency {
  id: number;
  name: string;
  phone_number: string;
  city: string;
  address: string;
  longitude: string;
  latitude: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  postal_code: string;
  is_active: boolean;
}

// Define the store data interface
interface StoreData {
  company_id: string;
  store_name: string;
  store_address: string;
  city: string;
  postal_code: string;
  phone_number?: string;
  latitude?: number;
  longitude?: number;
}

// Define the state interface
interface AgencyState {
  stores: Agency[] | { stores?: Agency[] } | any;
  loading: boolean;
  error: string | null;
  registerSuccess: boolean;
}

// Initial state
const initialState: AgencyState = {
  stores: [],
  loading: false,
  error: null,
  registerSuccess: false,
};

// Create async thunks for API calls
export const registerStore = createAsyncThunk(
  'agency/registerStore',
  async ({ dnsPrefix, data }: { dnsPrefix: string; data: StoreData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value.toString());
      });
      const response = await agencyService.registerStore(dnsPrefix, formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register store');
    }
  }
);

export const fetchAllStores = createAsyncThunk(
  'agency/fetchAllStores',
  async (dnsPrefix: string, { rejectWithValue }) => {
    try {
      const response = await agencyService.getAllStores(dnsPrefix);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stores');
    }
  }
);

// Create the slice
const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register store
    builder
      .addCase(registerStore.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerStore.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(registerStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Fetch all stores
    builder
      .addCase(fetchAllStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetRegisterSuccess, clearError } = agencySlice.actions;
export default agencySlice.reducer;
