import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { testService, RunTestsResponse, HealthCheckResponse, ListTestsResponse } from '../../services/testService';

// Define the state interface
interface TestState {
  tests: RunTestsResponse | null;
  loading: boolean;
  error: string | null;
  selectedTests: string[];  // Changed to string[] to store testFilePaths
  currentPage: number;
  searchTerm: string;
  health: HealthCheckResponse | null;
  availableTests: ListTestsResponse | null;
}

// Initial state
const initialState: TestState = {
  tests: null,
  loading: false,
  error: null,
  selectedTests: [],
  currentPage: 1,
  searchTerm: '',
  health: null,
  availableTests: null,
};

// Async thunks
export const runTests = createAsyncThunk(
  'test/runTests',
  async () => {
    const response = await testService.runTests();
    return response;
  }
);

export const checkHealth = createAsyncThunk(
  'test/checkHealth',
  async () => {
    const response = await testService.getHealth();
    return response;
  }
);

export const fetchAvailableTests = createAsyncThunk(
  'test/fetchAvailableTests',
  async () => {
    const response = await testService.listTests();
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
      const testPath = action.payload;
      const index = state.selectedTests.indexOf(testPath);
      if (index === -1) {
        state.selectedTests.push(testPath);
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
      state.tests = null;
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
      })
      // Handle fetchAvailableTests
      .addCase(fetchAvailableTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTests.fulfilled, (state, action) => {
        state.loading = false;
        state.availableTests = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch available tests';
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
export const selectAvailableTests = (state: { test: TestState }) => state.test.availableTests;

// Export filtered available tests selector
export const selectFilteredAvailableTests = (state: { test: TestState }) => {
  const { availableTests, searchTerm } = state.test;
  if (!availableTests || !searchTerm) return availableTests;

  return {
    ...availableTests,
    data: {
      ...availableTests.data,
      tests: availableTests.data.tests.map(file => ({
        ...file,
        describes: file.describes.filter(describe => 
          describe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          describe.tests.some(test => 
            test.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ),
        tests: file.tests.filter(test =>
          test.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(file => file.describes.length > 0 || file.tests.length > 0)
    }
  };
};

// Export filtered tests selector
export const selectFilteredTests = (state: { test: TestState }) => {
  const { tests, searchTerm } = state.test;
  if (!tests || !searchTerm) return tests;
  
  const allTests = tests.data.testResults.flatMap(fileResult => 
    fileResult.testResults.map(test => ({
      ...test,
      testFilePath: fileResult.testFilePath
    }))
  );
  
  return {
    ...tests,
    data: {
      ...tests.data,
      testResults: tests.data.testResults.map(fileResult => ({
        ...fileResult,
        testResults: fileResult.testResults.filter(test =>
          test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.ancestorTitles.some(title => 
            title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      })).filter(fileResult => fileResult.testResults.length > 0)
    }
  };
};

// Export the reducer
export default testSlice.reducer;
