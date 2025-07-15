import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { agencyService } from '../../services/agencyService';

// Define the Agency interface
export interface Agency {
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
  region?: "North" | "South" | "all";
  order_limit?: number;
  budget_limit?: number;
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
  region?: string;
  order_limit?: number | null;
  budget_limit?: number | null;
}

interface StoreBudget {
  total_budget: number;
  used_budget: number;
  remaining_budget: number;
}

// Define the state interface
interface AgencyState {
  stores: Agency[] | { stores?: Agency[] } | any;
  loading: boolean;
  error: string | null;
  registerSuccess: boolean;
  modifySuccess: boolean;
  deleteSuccess: boolean;
  storeDetails: { store: Agency } | null;
  selectedStore: string | null;
  previousPath: string | null;
  storeBudget: StoreBudget | null;
}

// Initial state
const initialState: AgencyState = {
  stores: [],
  loading: false,
  error: null,
  registerSuccess: false,
  modifySuccess: false,
  deleteSuccess: false,
  storeDetails: null,
  selectedStore: null,
  previousPath: null,
  storeBudget: null,
};

// Create async thunks for API calls
export const registerStore = createAsyncThunk(
  'agency/registerStore',
  async ({ dnsPrefix, data }: { dnsPrefix: string; data: StoreData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      const response = await agencyService.registerStore(dnsPrefix, formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register store');
    }
  }
);

export const modifyStore = createAsyncThunk(
  'agency/modifyStore',
  async ({ dnsPrefix, storeId, data }: { dnsPrefix: string; storeId: string; data: StoreData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
      });
      const response = await agencyService.modifyStore(dnsPrefix, storeId, formData);
      return response;
    } catch (error: any) {
      
      return rejectWithValue(error.response?.data?.message || 'Failed to modify store');
    }
  }
);

export const deleteStore = createAsyncThunk(
  'agency/deleteStore',
  async ({ dnsPrefix, storeId }: { dnsPrefix: string; storeId: string }, { rejectWithValue }) => {
    try {
      const response = await agencyService.deleteStore(dnsPrefix, storeId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete store');
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

export const getStoreDetails = createAsyncThunk(
  'agency/getStoreDetails',
  async ({ dnsPrefix, storeId }: { dnsPrefix: string; storeId: string }, { rejectWithValue }) => {
    try {
      const response = await agencyService.getStoreDetails(dnsPrefix, storeId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch store details');
    }
  }
);

export const getStoreBudget = createAsyncThunk(
  'agency/getStoreBudget',
  async ({ dnsPrefix, storeId }: { dnsPrefix: string; storeId: string }, { rejectWithValue }) => {
    try {
      const response = await agencyService.getStoreBudget(dnsPrefix, storeId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch store budget');
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
    resetModifySuccess: (state) => {
      state.modifySuccess = false;
    },
    resetDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearStoreDetails: (state) => {
      state.storeDetails = null;
    },
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },
    setPreviousPath: (state, action) => {
      state.previousPath = action.payload;
    },
    clearStoreBudget: (state) => {
      state.storeBudget = null;
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
      
    // Modify store
    builder
      .addCase(modifyStore.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.modifySuccess = false;
      })
      .addCase(modifyStore.fulfilled, (state) => {
        state.loading = false;
        state.modifySuccess = true;
      })
      .addCase(modifyStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Delete store
    builder
      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteStore.fulfilled, (state) => {
        state.loading = false;
        state.deleteSuccess = true;
      })
      .addCase(deleteStore.rejected, (state, action) => {
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

    // Get store details
    builder
      .addCase(getStoreDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.storeDetails = action.payload;
      })
      .addCase(getStoreDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get store budget
    builder
      .addCase(getStoreBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.storeBudget = action.payload;
      })
      .addCase(getStoreBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  resetRegisterSuccess, 
  resetModifySuccess, 
  resetDeleteSuccess,
  clearError, 
  clearStoreDetails, 
  setSelectedStore,
  setPreviousPath,
  clearStoreBudget
} = agencySlice.actions;
export default agencySlice.reducer;
