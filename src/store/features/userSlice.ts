import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService, UserRegistrationData, FetchUsersParams, UserModificationData } from '../../services/userService';

interface UserState {
  currentUser: {
    firstname: string;
    lastname: string;
    email: string;
    store_ids: number[];
  } | null;
  users: {
    data: Array<{
      firstname: string;
      lastname: string;
      email: string;
      store_ids: number[];
    }>;
    total: number;
    page: number;
    limit: number;
  };
  selectedUser: {
    firstname: string;
    lastname: string;
    email: string;
    store_ids: number[];
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  users: {
    data: [],
    total: 0,
    page: 1,
    limit: 10
  },
  selectedUser: null,
  isLoading: false,
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'user/register',
  async ({ dnsPrefix, data }: { dnsPrefix: string; data: UserRegistrationData }, { rejectWithValue }) => {
    try {
      const response = await userService.registerUser(dnsPrefix, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async ({ dnsPrefix, params }: { dnsPrefix: string; params?: FetchUsersParams }, { rejectWithValue }) => {
    try {
      const response = await userService.fetchUsers(dnsPrefix, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Async thunk for getting user details
export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async ({ dnsPrefix, userId }: { dnsPrefix: string; userId: string | number }, { rejectWithValue }) => {
    try {
      const response = await userService.getUserDetails(dnsPrefix, userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

// Async thunk for modifying user
export const modifyUser = createAsyncThunk(
  'user/modifyUser',
  async ({ 
    dnsPrefix, 
    userId, 
    data 
  }: { 
    dnsPrefix: string; 
    userId: string | number; 
    data: UserModificationData 
  }, { rejectWithValue }) => {
    try {
      const response = await userService.modifyUser(dnsPrefix, userId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to modify user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.selectedUser = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add cases for fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add cases for getUserDetails
      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add cases for modifyUser
      .addCase(modifyUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(modifyUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the selected user if it exists
        if (state.selectedUser) {
          state.selectedUser = action.payload;
        }
        
        state.error = null;
      })
      .addCase(modifyUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError, logout } = userSlice.actions;
export default userSlice.reducer;
