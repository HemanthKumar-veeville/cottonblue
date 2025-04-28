import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientService, ClientRegistrationData } from '../../services/clientService';

export interface CompanyModificationData {
  company_name?: string;
  company_address?: string;
  city?: string;
  postal_code?: string;
  phone_number?: string;
  logo?: File;
  color_code?: string;
  is_active?: boolean;
}

interface ClientState {
  loading: boolean;
  error: string | null;
  success: boolean;
  companies: any[];
  selectedCompany: {
    id: string;
    name: string;
    dns: string;
  } | null;
  companyDetails: any | null;
  carousel: {
    images: string[];
    is_active: boolean;
    auto_play: boolean;
  } | null;
}

const initialState: ClientState = {
  loading: false,
  error: null,
  success: false,
  companies: [],
  selectedCompany: null,
  companyDetails: null,
  carousel: null,
};

export const registerClient = createAsyncThunk(
  'client/register',
  async (data: ClientRegistrationData, { rejectWithValue }) => {
    try {
      const response = await clientService.registerClient(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const getAllCompanies = createAsyncThunk(
  'client/getAllCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientService.getAllCompanies();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch companies');
    }
  }
);

export const getCompanyByDnsPrefix = createAsyncThunk(
  'client/getCompanyByDnsPrefix',
  async (dns_prefix: string, { rejectWithValue }) => {
    try {
      const response = await clientService.getCompanyByDnsPrefix(dns_prefix);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company details');
    }
  }
);

export const modifyCompany = createAsyncThunk(
  'client/modifyCompany',
  async ({ 
    dns_prefix, 
    company_id, 
    data 
  }: { 
    dns_prefix: string; 
    company_id: string; 
    data: CompanyModificationData 
  }, { rejectWithValue }) => {
    try {
      const response = await clientService.modifyCompany(dns_prefix, company_id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to modify company');
    }
  }
);

export const getCarousel = createAsyncThunk(
  'client/getCarousel',
  async (dns_prefix: string, { rejectWithValue }) => {
    try {
      const response = await clientService.getCarousel(dns_prefix);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch carousel data');
    }
  }
);

export const createCarousel = createAsyncThunk(
  'client/createCarousel',
  async ({ 
    dns_prefix, 
    data 
  }: { 
    dns_prefix: string; 
    data: { 
      carousel_images: File[];
      is_active: boolean;
      auto_play: boolean;
    } 
  }, { rejectWithValue }) => {
    try {
      const response = await clientService.createCarousel(dns_prefix, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create carousel');
    }
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.carousel = null;
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerClient.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
        
        if (!state.selectedCompany && action.payload.companies.length > 0) {
          state.selectedCompany = {
            id: action.payload.companies[0].id,
            name: action.payload.companies[0].name,
            dns: action.payload.companies[0].dns_prefix,
          };
        }
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCompanyByDnsPrefix.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyByDnsPrefix.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails = action.payload;
      })
      .addCase(getCompanyByDnsPrefix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(modifyCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(modifyCompany.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(modifyCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getCarousel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarousel.fulfilled, (state, action) => {
        state.loading = false;
        state.carousel = action.payload;
      })
      .addCase(getCarousel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCarousel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCarousel.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCarousel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetState, setSelectedCompany } = clientSlice.actions;
export default clientSlice.reducer;
