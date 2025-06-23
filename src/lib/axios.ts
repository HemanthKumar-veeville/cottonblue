import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_API_URL || "";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "access-control-allow-credentials": true,
    "ngrok-skip-browser-warning": "69420",
    'Accept-Language': 'en',
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can handle loading states here if needed
    return config;
  },
  (error) => {
    toast.error('Request failed to send');
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Show success toast only for non-GET requests and non-addToCart endpoints
    if (response.config.method !== 'get' && !response.config.url?.includes('add-to-cart')) {
      // Check if there's a custom success message in the response
      const message = response.data?.message || 'Operation successful';
      toast.success(message, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#10B981', // Green color
          color: '#fff',
        },
      });
    }
    return response;
  },
  (error) => {
    // Handle different types of errors
    let errorMessage = 'Something went wrong';

    if (error.response) {
      // Skip error toast for addToCart endpoint
      if (error.config.url?.includes('addToCart')) {
        return Promise.reject(error);
      }
      
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.detail || error.response.data?.message || error.response.data?.error || errorMessage;
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          errorMessage = errorMessage || "Unauthorized access. Please login again.";
          break;
        case 403:
          errorMessage = errorMessage || "You do not have permission to perform this action.";
          break;
        case 404:
          errorMessage = errorMessage || "The requested resource was not found.";
          break;
        case 422:
          errorMessage = errorMessage || "Validation failed. Please check your input.";
          break;
        case 500:
          errorMessage = errorMessage || "Server error. Please try again later.";
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = errorMessage || "No response from server. Please check your internet connection.";
    }

    toast.error(errorMessage, {
      duration: 6000, // Slightly longer duration for error messages
      position: 'top-right',
      style: {
        background: '#EF4444', // Red color
        color: '#fff',
      },
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;

