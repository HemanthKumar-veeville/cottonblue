import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, LoginResponse } from '../../services/authService';

interface AuthState {
  company: string | null;
  companyColor: string | null;
  companyLogo: string | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  company: null,
  companyColor: null,
  companyLogo: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, company }: { email: string; password: string; company: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password, company);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const loginPage = createAsyncThunk(
  'auth/loginPage',
  async (company: string, { rejectWithValue }) => {
    try {
      const response = await authService.loginPage(company);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch login page data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Page
      .addCase(loginPage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginPage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload.company;
        state.companyColor = action.payload.company_color;
        state.companyLogo = action.payload.company_logo;
      })
      .addCase(loginPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload.company;
        state.companyColor = action.payload.company_color;
        state.companyLogo = action.payload.company_logo;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 