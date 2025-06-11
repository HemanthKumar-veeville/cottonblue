import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface TestResult {
  title: string;
  status: string;
  duration: number;
  failureMessages: string[];
  ancestorTitles: string[];
}

export interface TestFileResult {
  testFilePath: string;
  numFailingTests: number;
  numPassingTests: number;
  numPendingTests: number;
  testResults: TestResult[];
}

interface TestData {
  success: boolean;
  startTime: number;
  duration: number | null;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  testResults: TestFileResult[];
}

export interface RunTestsResponse {
  success: boolean;
  message: string;
  data: TestData;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  uptime: number;
  timestamp: string;
}

export const testService = {
  /**
   * Run tests for a specific company
   * @returns Promise with test execution results
   */
  runTests: async (): Promise<RunTestsResponse> => {
    const response = await axiosInstance.post(`/api/run-tests`);
    return response.data;
  },

  /**
   * Get health status of the application
   * @returns Promise with health check response
   */
  getHealth: async (): Promise<HealthCheckResponse> => {
    const response = await axiosInstance.get('/api/health');
    return response.data;
  }
};
