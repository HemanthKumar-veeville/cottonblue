import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientService, ClientRegistrationData, CarouselUpdateData } from '../../services/clientService';

export interface CompanyModificationData {
  company_name?: string;
  company_address?: string;
  city?: string;
  postal_code?: string;
  phone_number?: string;
  logo?: File;
  color_code?: string;
  is_active?: boolean;
  vat_number?: string;
}

interface ClientState {
  loading: boolean;
  error: string | null;
  success: boolean;
  companies: any[];
  total: number;
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
  currentPageClient: number;
}

const initialState: ClientState = {
  loading: false,
  error: null,
  success: false,
  companies: [],
  selectedCompany: null,
  companyDetails: null,
  carousel: null,
  total: 0,
  currentPageClient: 1,
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
  async ({ page, limit, search }: { page: number; limit: number; search: string }, { rejectWithValue }) => {
    try {
      const response = await clientService.getAllCompanies(page, limit, search);
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

export const deleteCarouselImage = createAsyncThunk(
  'client/deleteCarouselImage',
  async ({ 
    dns_prefix, 
    image_id 
  }: { 
    dns_prefix: string; 
    image_id: string;
  }, { rejectWithValue }) => {
    try {
      const response = await clientService.deleteCarouselImage(dns_prefix, image_id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete carousel image');
    }
  }
);

export const updateCarousel = createAsyncThunk(
  'client/updateCarousel',
  async ({ 
    dns_prefix, 
    data 
  }: { 
    dns_prefix: string; 
    data: CarouselUpdateData 
  }, { rejectWithValue }) => {
    try {
      const response = await clientService.updateCarousel(dns_prefix, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update carousel');
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
      state.companyDetails = null;
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
        state.total = action.payload.total_companies_count;
        state.currentPageClient = action.payload.page;
        
        if (!state.selectedCompany && action.payload.companies.length > 0) {
          const defaultCompany = action.payload.companies.find((company: any) => company.dns_prefix === 'chronodrive') || action.payload.companies[0];
          state.selectedCompany = {
            id: defaultCompany.id,
            name: defaultCompany.name,
            dns: defaultCompany.dns_prefix,
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
      })
      .addCase(deleteCarouselImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCarouselImage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteCarouselImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(updateCarousel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCarousel.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateCarousel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetState, setSelectedCompany } = clientSlice.actions;
export default clientSlice.reducer;
