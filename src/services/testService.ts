import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Test {
  id: number;
  name: string;
  type: string;
  status: string;
  lastRun: string;
  duration: string;
  success_rate: number;
}

export interface RunTestsResponse {
  message: string;
  tests: Test[];
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
   * @param dns_prefix DNS prefix of the company
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
