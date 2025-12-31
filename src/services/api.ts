import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../utils/constants';
import { getToken, clearAuth } from '../utils/helpers';
import { getDummyResponse } from './dummyApi';

// Track backend availability
let isBackendAvailable = true;
let lastBackendCheck = 0;
const BACKEND_CHECK_INTERVAL = 10000; // 10 seconds

const checkBackendAvailability = async (): Promise<boolean> => {
  const now = Date.now();
  if (now - lastBackendCheck < BACKEND_CHECK_INTERVAL) {
    return isBackendAvailable;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    isBackendAvailable = response.ok;
  } catch {
    isBackendAvailable = false;
  }
  
  lastBackendCheck = now;
  return isBackendAvailable;
};

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Check if this is a network error or timeout
    const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
    
    if (isNetworkError) {
      // Mark backend as unavailable
      isBackendAvailable = false;
      lastBackendCheck = Date.now();
      
      // Try to return dummy data
      const config = error.config;
      if (config) {
        const method = config.method || 'get';
        const url = config.url || '';
        const params = config.params || config.data;
        
        try {
          const dummyData = getDummyResponse(method, url, params) as { data: { success: boolean; data: unknown } };
          // Return as a mock response
          return {
            data: dummyData.data,
            status: 200,
            statusText: 'OK (Demo Mode)',
            headers: {},
            config,
          } as AxiosResponse;
        } catch {
          // If dummy data fails, reject with original error
        }
      }
    }
    
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export function to get backend status
export const getBackendStatus = () => isBackendAvailable;

// Export function to force backend check
export const forceBackendCheck = () => checkBackendAvailability();

export default api;
