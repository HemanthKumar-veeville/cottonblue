import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { testService, Test, HealthCheckResponse } from '../../services/testService';

// Define the state interface
interface TestState {
  tests: Test[];
  loading: boolean;
  error: string | null;
  selectedTests: number[];
  currentPage: number;
  searchTerm: string;
  health: HealthCheckResponse | null;
}

// Initial state
const initialState: TestState = {
  tests: [],
  loading: false,
  error: null,
  selectedTests: [],
  currentPage: 1,
  searchTerm: '',
  health: null,
};

// Async thunks
export const runTests = createAsyncThunk(
  'test/runTests',
  async () => {
    const response = await testService.runTests();
    return response.tests;
  }
);

export const checkHealth = createAsyncThunk(
  'test/checkHealth',
  async () => {
    const response = await testService.getHealth();
    return response;
  }
);

// Create the slice
const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    toggleTestSelection: (state, action) => {
      const testId = action.payload;
      const index = state.selectedTests.indexOf(testId);
      if (index === -1) {
        state.selectedTests.push(testId);
      } else {
        state.selectedTests.splice(index, 1);
      }
    },
    setSelectedTests: (state, action) => {
      state.selectedTests = action.payload;
    },
    clearSelectedTests: (state) => {
      state.selectedTests = [];
    },
    clearTests: (state) => {
      state.tests = [];
      state.selectedTests = [];
      state.currentPage = 1;
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    // Handle runTests
    builder
      .addCase(runTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
        state.error = null;
      })
      .addCase(runTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to run tests';
      })
      // Handle checkHealth
      .addCase(checkHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.health = action.payload;
        state.error = null;
      })
      .addCase(checkHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Health check failed';
      });
  },
});

// Export actions
export const {
  setSearchTerm,
  setCurrentPage,
  toggleTestSelection,
  setSelectedTests,
  clearSelectedTests,
  clearTests,
} = testSlice.actions;

// Export selectors
export const selectTests = (state: { test: TestState }) => state.test.tests;
export const selectLoading = (state: { test: TestState }) => state.test.loading;
export const selectError = (state: { test: TestState }) => state.test.error;
export const selectSelectedTests = (state: { test: TestState }) => state.test.selectedTests;
export const selectCurrentPage = (state: { test: TestState }) => state.test.currentPage;
export const selectSearchTerm = (state: { test: TestState }) => state.test.searchTerm;

// Export filtered tests selector
export const selectFilteredTests = (state: { test: TestState }) => {
  const { tests, searchTerm } = state.test;
  if (!searchTerm) return tests;
  
  return tests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Export the reducer
export default testSlice.reducer;
