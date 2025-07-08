import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, ErrorLogsResponse } from '../../services/authService';

interface AuthState {
  company: string | null;
  companyColor: string | null;
  companyTextColor: string | null;
  companyLogo: string | null;
  isLoading: boolean;
  error: string | null;
  loginError: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isClientAdmin: boolean;
  user: any;
  adminMode: boolean;
  passwordResetSuccess: boolean;
  forgotPasswordEmailSent: boolean;
  errorLogs: ErrorLogsResponse | null;
  errorLogsLoading: boolean;
}

const initialState: AuthState = {
  company: null,
  companyColor: null,
  companyTextColor: null,
  companyLogo: null,
  isLoading: false,
  error: null,
  loginError: null,
  isLoggedIn: false,
  user: null,
  isAdmin: false,
  isClientAdmin: false,
  adminMode: false,
  passwordResetSuccess: false,
  forgotPasswordEmailSent: false,
  errorLogs: null,
  errorLogsLoading: false,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, company }: { email: string; password: string; company: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password, company);
      console.table(response);
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

export const logout = createAsyncThunk(
  'auth/logout',
  async (company: string, { rejectWithValue }) => {
    try {
      const response = await authService.logout(company);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (company: string, { rejectWithValue }) => {
    try {
      const response = await authService.getUser(company);  
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ 
    dnsPrefix, 
    userId, 
    token, 
    newPassword 
  }: { 
    dnsPrefix: string; 
    userId: string; 
    token: string; 
    newPassword: string;
  }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(dnsPrefix, userId, token, newPassword);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ dnsPrefix, email }: { dnsPrefix: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(dnsPrefix, email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send password reset email');
    }
  }
);

export const getErrorLogs = createAsyncThunk(
  'auth/getErrorLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getErrorLogs();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch error logs');
    }
  }
);

export const clearErrorLogs = createAsyncThunk(
  'auth/clearErrorLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.clearErrorLogs();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear error logs');
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
    setAdminMode: (state, action) => {
      state.adminMode = action.payload;
    },
    clearPasswordResetStatus: (state) => {
      state.passwordResetSuccess = false;
      state.forgotPasswordEmailSent = false;
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
        state.companyColor = action.payload.company_bg_color;
        state.companyTextColor = action.payload.company_text_color;
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
        state.loginError = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.company = null;
        state.companyColor = null;
        state.companyLogo = null;
        state.isLoggedIn = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;  
        state.error = action.payload as string;
        state.passwordResetSuccess = false;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.forgotPasswordEmailSent = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.forgotPasswordEmailSent = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.forgotPasswordEmailSent = false;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = action.payload.logged_in;
        state.isClientAdmin = action.payload.company_admin;
        state.company = action.payload.company_name || null;
        if(action.payload.logged_in){
          state.companyColor = action.payload.company_bg_color;
          state.companyTextColor = action.payload.company_text_color;
          state.companyLogo = action.payload.company_logo;
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Error Logs
      .addCase(getErrorLogs.pending, (state) => {
        state.errorLogsLoading = true;
        state.error = null;
      })
      .addCase(getErrorLogs.fulfilled, (state, action) => {
        state.errorLogsLoading = false;
        state.errorLogs = action.payload;
      })
      .addCase(getErrorLogs.rejected, (state, action) => {
        state.errorLogsLoading = false;
        state.error = action.payload as string;
      })
        // Clear Error Logs
        .addCase(clearErrorLogs.pending, (state) => {
          state.errorLogsLoading = true;
          state.error = null;
        })
        .addCase(clearErrorLogs.fulfilled, (state, action) => {
          state.errorLogsLoading = false;
          state.errorLogs = action.payload;
        })
        .addCase(clearErrorLogs.rejected, (state, action) => {
          state.errorLogsLoading = false;
          state.error = action.payload as string;
        });
  },
});

export const { clearError, setAdminMode, clearPasswordResetStatus } = authSlice.actions;
export default authSlice.reducer; 