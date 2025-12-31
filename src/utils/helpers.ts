import { TOKEN_KEY, USER_KEY } from './constants';
import type { User } from '../types';

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number): string => {
  return `PKR ${amount.toFixed(2)}`;
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  }
  return `${km.toFixed(1)} km`;
};

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'requested':
      return '#f59e0b';
    case 'accepted':
      return '#3b82f6';
    case 'in-progress':
      return '#8b5cf6';
    case 'completed':
      return '#10b981';
    case 'cancelled':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

export const truncateAddress = (address: string, maxLength: number = 30): string => {
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength) + '...';
};
