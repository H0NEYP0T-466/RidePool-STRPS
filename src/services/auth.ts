import api from './api';
import type { UserCreate, UserLogin, User, AuthResponse, ApiResponse } from '../types';

export const register = async (userData: UserCreate): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', userData);
  return response.data.data;
};

export const login = async (credentials: UserLogin): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/api/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/api/auth/me');
  return response.data.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put<ApiResponse<User>>('/api/user/profile', data);
  return response.data.data;
};
