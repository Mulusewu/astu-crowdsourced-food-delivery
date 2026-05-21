import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "../types/common.types";
import { useAuthStore } from "../../store/auth/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
  withCredentials: true, 
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Read from Zustand state directly instead of localStorage
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle token refresh on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
         const response = await axios.post(`${API_URL}/auth/refresh`, {}, { 
          withCredentials: true 
        });

        const newAccessToken = response.data.data.accessToken;
        
        // Update Zustand Store
        useAuthStore.getState().setToken(newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        useAuthStore.getState().logout();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    // Format error message
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    const errors = error.response?.data?.errors;

    return Promise.reject({
      message: errorMessage,
      errors,
      statusCode: error.response?.status,
    });
  },
);

export default apiClient;
