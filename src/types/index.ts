// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'driver' | 'admin';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreate {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'user' | 'driver' | 'admin';
}

export interface UserLogin {
  email: string;
  password: string;
}

// Location types
export interface Location {
  lat: number;
  lng: number;
}

export interface LocationWithAddress extends Location {
  address: string;
}

// Driver types
export interface Driver {
  id: string;
  userId: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  currentLocation?: Location;
  isAvailable: boolean;
  rating: number;
  totalTrips: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriverWithUser extends Driver {
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export interface NearbyDriver {
  driverId: string;
  userId: string;
  name: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  totalTrips: number;
  distance: number;
  location: Location;
}

// Passenger types
export interface Passenger {
  userId: string;
  pickupLocation: LocationWithAddress;
  dropoffLocation: LocationWithAddress;
  status: 'pending' | 'picked' | 'dropped';
  fare: number;
}

// Ride types
export interface Ride {
  id: string;
  driverId?: string;
  passengers: Passenger[];
  isPooled: boolean;
  status: 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  route: Location[];
  totalFare: number;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  driverName?: string;
}

export interface RideWithDriver extends Ride {
  driver?: {
    name: string;
    vehicleType: string;
    vehicleNumber: string;
    rating: number;
    currentLocation?: Location;
  };
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  rideId?: string;
  pickupLocation: LocationWithAddress;
  dropoffLocation: LocationWithAddress;
  wantPooling: boolean;
  status: 'requested' | 'matched' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface BookingCreate {
  pickupLocation: LocationWithAddress;
  dropoffLocation: LocationWithAddress;
  wantPooling: boolean;
}

// Feedback types
export interface Feedback {
  id: string;
  userId: string;
  rideId: string;
  driverId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  userName?: string;
  driverName?: string;
}

export interface FeedbackCreate {
  rideId: string;
  driverId: string;
  rating: number;
  comment?: string;
}

// Fare types
export interface FareInfo {
  distance: number;
  baseFare: number;
  distanceFare: number;
  discount: number;
  totalFare: number;
}

// Pool Match types
export interface PoolMatch {
  rideId: string;
  driverId?: string;
  currentPassengers: number;
  deviation: number;
  discountPercentage: number;
}

// Dashboard types
export interface DashboardMetrics {
  totalUsers: number;
  totalDrivers: number;
  totalRides: number;
  activeRides: number;
  completedRides: number;
  totalRevenue: number;
  averageRating: number;
}

export interface PaymentSummary {
  totalRides: number;
  completedRides: number;
  pooledRides: number;
  totalRevenue: number;
  averageFare: number;
}

export interface Payment {
  rideId: string;
  totalFare: number;
  isPooled: boolean;
  passengerCount: number;
  completedAt?: string;
  driverName?: string;
}

// Ride request for drivers
export interface RideRequest {
  bookingId: string;
  userId: string;
  userName: string;
  pickupLocation: LocationWithAddress;
  dropoffLocation: LocationWithAddress;
  wantPooling: boolean;
  fare: number;
  createdAt: string;
}

// Pagination types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// Auth Response types
export interface AuthResponse {
  user: User;
  token: string;
}

// WebSocket event types
export interface LocationUpdateEvent {
  driverId: string;
  lat: number;
  lng: number;
  timestamp: string;
}

export interface RideStatusEvent {
  rideId: string;
  status: string;
  timestamp: string;
}

export interface NewRideRequestEvent {
  bookingId: string;
  userId: string;
  userName: string;
  pickupLocation: LocationWithAddress;
  dropoffLocation: LocationWithAddress;
  fare: number;
}

export interface RideAcceptedEvent {
  rideId: string;
  driverId: string;
  driverName: string;
  vehicleType: string;
  vehicleNumber: string;
  eta: number;
}

export interface RideStartedEvent {
  rideId: string;
  startTime: string;
}

export interface RideCompletedEvent {
  rideId: string;
  endTime: string;
  totalFare: number;
}

export interface PoolMatchFoundEvent {
  rideId: string;
  matchedRideId: string;
  discountPercentage: number;
}
