export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8888';

export const PAKISTAN_CITIES = {
  Islamabad: { lat: 33.6844, lng: 73.0479 },
  Lahore: { lat: 31.5204, lng: 74.3587 },
  Karachi: { lat: 24.8607, lng: 67.0011 },
  Rawalpindi: { lat: 33.5651, lng: 73.0169 },
  Faisalabad: { lat: 31.4504, lng: 73.1350 },
  Multan: { lat: 30.1575, lng: 71.5249 },
  Peshawar: { lat: 34.0151, lng: 71.5249 },
  Hyderabad: { lat: 25.3960, lng: 68.3578 },
};

export const DEFAULT_CENTER = PAKISTAN_CITIES.Islamabad;

export const RIDE_STATUSES = {
  requested: 'Requested',
  accepted: 'Accepted',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUSES = {
  pending: 'Pending',
  paid: 'Paid',
};

export const USER_ROLES = {
  user: 'User',
  driver: 'Driver',
  admin: 'Admin',
};

export const TOKEN_KEY = 'ridepool_token';
export const USER_KEY = 'ridepool_user';
