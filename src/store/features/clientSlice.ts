import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientService, ClientRegistrationData } from '../../services/clientService';

interface ClientState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ClientState = {
  loading: false,
  error: null,
  success: false,
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

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
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
      });
  },
});

export const { resetState } = clientSlice.actions;
export default clientSlice.reducer;
