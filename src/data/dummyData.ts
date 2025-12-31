/**
 * Dummy data for frontend-only mode
 * Used when backend is unavailable
 */

import type { User, Booking, Ride, RideRequest, DashboardMetrics, Driver, NearbyDriver, FareInfo, Feedback, Payment, PaymentSummary } from '../types';

// Test credentials that work in frontend-only mode
export const DUMMY_CREDENTIALS = {
  user: {
    email: 'user1@ridepool.pk',
    password: 'password123',
  },
  driver: {
    email: 'driver1@ridepool.pk',
    password: 'password123',
  },
  admin: {
    email: 'admin1@ridepool.pk',
    password: 'password123',
  },
};

// Dummy users
export const DUMMY_USERS: Record<string, User & { password: string }> = {
  'user1@ridepool.pk': {
    id: 'user-001',
    name: 'Ahmed Khan',
    email: 'user1@ridepool.pk',
    phone: '+923001234567',
    role: 'user',
    password: 'password123',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-30T12:00:00Z',
  },
  'driver1@ridepool.pk': {
    id: 'driver-001',
    name: 'Ali Raza',
    email: 'driver1@ridepool.pk',
    phone: '+923009876543',
    role: 'driver',
    password: 'password123',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-12-30T12:00:00Z',
  },
  'admin1@ridepool.pk': {
    id: 'admin-001',
    name: 'Usman Ahmed',
    email: 'admin1@ridepool.pk',
    phone: '+923005555555',
    role: 'admin',
    password: 'password123',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-30T12:00:00Z',
  },
};

// Dummy driver profile
export const DUMMY_DRIVER_PROFILE: Driver = {
  id: 'driver-profile-001',
  userId: 'driver-001',
  vehicleType: 'Sedan',
  vehicleNumber: 'LEA-5678',
  licenseNumber: 'DL-123456',
  currentLocation: { lat: 33.6844, lng: 73.0479 },
  isAvailable: true,
  rating: 4.7,
  totalTrips: 127,
  createdAt: '2024-01-10T08:00:00Z',
  updatedAt: '2024-12-30T12:00:00Z',
};

// Dummy ride bookings for users
export const DUMMY_USER_RIDES: Booking[] = [
  {
    id: 'booking-001',
    userId: 'user-001',
    rideId: 'ride-001',
    pickupLocation: {
      lat: 33.6844,
      lng: 73.0479,
      address: '123 Blue Area, Islamabad',
    },
    dropoffLocation: {
      lat: 33.7294,
      lng: 73.0931,
      address: '456 F-7 Markaz, Islamabad',
    },
    wantPooling: true,
    status: 'completed',
    fare: 450,
    paymentStatus: 'paid',
    createdAt: '2024-12-28T14:30:00Z',
    updatedAt: '2024-12-28T15:15:00Z',
  },
  {
    id: 'booking-002',
    userId: 'user-001',
    rideId: 'ride-002',
    pickupLocation: {
      lat: 33.6501,
      lng: 73.0156,
      address: '789 G-10, Islamabad',
    },
    dropoffLocation: {
      lat: 33.7047,
      lng: 73.0594,
      address: '321 F-6, Islamabad',
    },
    wantPooling: false,
    status: 'completed',
    fare: 320,
    paymentStatus: 'paid',
    createdAt: '2024-12-27T09:00:00Z',
    updatedAt: '2024-12-27T09:45:00Z',
  },
  {
    id: 'booking-003',
    userId: 'user-001',
    pickupLocation: {
      lat: 33.6844,
      lng: 73.0479,
      address: '55 Blue Area, Islamabad',
    },
    dropoffLocation: {
      lat: 33.5651,
      lng: 73.0169,
      address: 'Saddar, Rawalpindi',
    },
    wantPooling: true,
    status: 'requested',
    fare: 580,
    paymentStatus: 'pending',
    createdAt: '2024-12-30T10:00:00Z',
    updatedAt: '2024-12-30T10:00:00Z',
  },
];

// Dummy ride requests for drivers (includes both pooled and non-pooled)
export const DUMMY_RIDE_REQUESTS: RideRequest[] = [
  {
    bookingId: 'booking-100',
    userId: 'user-002',
    userName: 'Fatima Ali',
    pickupLocation: {
      lat: 33.7294,
      lng: 73.0931,
      address: '123 F-7 Markaz, Islamabad',
    },
    dropoffLocation: {
      lat: 33.6501,
      lng: 73.0156,
      address: '456 G-10 Markaz, Islamabad',
    },
    wantPooling: true,
    fare: 380,
    createdAt: '2024-12-30T11:00:00Z',
  },
  {
    bookingId: 'booking-101',
    userId: 'user-003',
    userName: 'Muhammad Hassan',
    pickupLocation: {
      lat: 33.6844,
      lng: 73.0479,
      address: '789 Blue Area, Islamabad',
    },
    dropoffLocation: {
      lat: 33.5651,
      lng: 73.0169,
      address: 'Saddar, Rawalpindi',
    },
    wantPooling: false,
    fare: 650,
    createdAt: '2024-12-30T10:45:00Z',
  },
  {
    bookingId: 'booking-102',
    userId: 'user-004',
    userName: 'Ayesha Malik',
    pickupLocation: {
      lat: 33.7047,
      lng: 73.0594,
      address: 'F-6 Super Market, Islamabad',
    },
    dropoffLocation: {
      lat: 33.6844,
      lng: 73.0479,
      address: 'Blue Area, Islamabad',
    },
    wantPooling: true,
    fare: 290,
    createdAt: '2024-12-30T10:30:00Z',
  },
  {
    bookingId: 'booking-103',
    userId: 'user-005',
    userName: 'Bilal Ahmad',
    pickupLocation: {
      lat: 33.6501,
      lng: 73.0156,
      address: 'G-10/4, Islamabad',
    },
    dropoffLocation: {
      lat: 33.7294,
      lng: 73.0931,
      address: 'F-7/3, Islamabad',
    },
    wantPooling: false,
    fare: 420,
    createdAt: '2024-12-30T09:15:00Z',
  },
];

// Dummy driver rides (history)
export const DUMMY_DRIVER_RIDES: Ride[] = [
  {
    id: 'ride-d001',
    driverId: 'driver-001',
    passengers: [
      {
        userId: 'user-002',
        pickupLocation: {
          lat: 33.6844,
          lng: 73.0479,
          address: 'Blue Area, Islamabad',
        },
        dropoffLocation: {
          lat: 33.7294,
          lng: 73.0931,
          address: 'F-7 Markaz, Islamabad',
        },
        status: 'dropped',
        fare: 350,
      },
    ],
    isPooled: false,
    status: 'completed',
    route: [],
    totalFare: 350,
    startTime: '2024-12-29T10:00:00Z',
    endTime: '2024-12-29T10:35:00Z',
    createdAt: '2024-12-29T09:55:00Z',
    updatedAt: '2024-12-29T10:35:00Z',
    driverName: 'Ali Raza',
  },
  {
    id: 'ride-d002',
    driverId: 'driver-001',
    passengers: [
      {
        userId: 'user-003',
        pickupLocation: {
          lat: 33.6501,
          lng: 73.0156,
          address: 'G-10, Islamabad',
        },
        dropoffLocation: {
          lat: 33.5651,
          lng: 73.0169,
          address: 'Saddar, Rawalpindi',
        },
        status: 'dropped',
        fare: 480,
      },
      {
        userId: 'user-004',
        pickupLocation: {
          lat: 33.6601,
          lng: 73.0256,
          address: 'G-9, Islamabad',
        },
        dropoffLocation: {
          lat: 33.5751,
          lng: 73.0269,
          address: 'Commercial Area, Rawalpindi',
        },
        status: 'dropped',
        fare: 420,
      },
    ],
    isPooled: true,
    status: 'completed',
    route: [],
    totalFare: 900,
    startTime: '2024-12-28T14:00:00Z',
    endTime: '2024-12-28T15:00:00Z',
    createdAt: '2024-12-28T13:50:00Z',
    updatedAt: '2024-12-28T15:00:00Z',
    driverName: 'Ali Raza',
  },
  {
    id: 'ride-d003',
    driverId: 'driver-001',
    passengers: [
      {
        userId: 'user-005',
        pickupLocation: {
          lat: 33.7047,
          lng: 73.0594,
          address: 'F-6, Islamabad',
        },
        dropoffLocation: {
          lat: 33.6844,
          lng: 73.0479,
          address: 'Blue Area, Islamabad',
        },
        status: 'dropped',
        fare: 250,
      },
    ],
    isPooled: false,
    status: 'completed',
    route: [],
    totalFare: 250,
    startTime: '2024-12-27T18:00:00Z',
    endTime: '2024-12-27T18:25:00Z',
    createdAt: '2024-12-27T17:55:00Z',
    updatedAt: '2024-12-27T18:25:00Z',
    driverName: 'Ali Raza',
  },
];

// Available pools for users to join
export interface AvailablePool {
  type: 'ride' | 'booking';
  id: string;
  pickupLocation: { lat: number; lng: number; address?: string };
  dropoffLocation: { lat: number; lng: number; address?: string };
  currentPassengers: number;
  maxPassengers: number;
  status: string;
  driver?: { name: string; vehicleType: string; rating: number };
  userName?: string;
  distance?: number;
  createdAt?: string;
}

export const DUMMY_AVAILABLE_POOLS: AvailablePool[] = [
  {
    type: 'ride',
    id: 'pool-001',
    pickupLocation: {
      lat: 33.6844,
      lng: 73.0479,
      address: 'Blue Area, Islamabad',
    },
    dropoffLocation: {
      lat: 33.5651,
      lng: 73.0169,
      address: 'Saddar, Rawalpindi',
    },
    currentPassengers: 2,
    maxPassengers: 4,
    status: 'in-progress',
    driver: {
      name: 'Hamza Iqbal',
      vehicleType: 'SUV',
      rating: 4.8,
    },
    distance: 2.5,
    createdAt: '2024-12-30T09:00:00Z',
  },
  {
    type: 'booking',
    id: 'pool-002',
    pickupLocation: {
      lat: 33.7294,
      lng: 73.0931,
      address: 'F-7, Islamabad',
    },
    dropoffLocation: {
      lat: 33.6501,
      lng: 73.0156,
      address: 'G-10, Islamabad',
    },
    currentPassengers: 1,
    maxPassengers: 4,
    status: 'requested',
    userName: 'Sara Khan',
    distance: 1.8,
    createdAt: '2024-12-30T10:30:00Z',
  },
  {
    type: 'ride',
    id: 'pool-003',
    pickupLocation: {
      lat: 33.7047,
      lng: 73.0594,
      address: 'F-6, Islamabad',
    },
    dropoffLocation: {
      lat: 33.7294,
      lng: 73.0931,
      address: 'F-7, Islamabad',
    },
    currentPassengers: 3,
    maxPassengers: 4,
    status: 'accepted',
    driver: {
      name: 'Faisal Mahmood',
      vehicleType: 'Sedan',
      rating: 4.5,
    },
    distance: 0.8,
    createdAt: '2024-12-30T11:15:00Z',
  },
];

// Admin dashboard metrics
export const DUMMY_ADMIN_METRICS: DashboardMetrics = {
  totalUsers: 156,
  totalDrivers: 42,
  totalRides: 1247,
  activeRides: 18,
  completedRides: 1185,
  totalRevenue: 2456780,
  averageRating: 4.6,
};

// Admin recent rides
export const DUMMY_ADMIN_RECENT_RIDES: Ride[] = [
  {
    id: 'admin-ride-001',
    driverId: 'driver-001',
    passengers: [
      {
        userId: 'user-001',
        pickupLocation: { lat: 33.6844, lng: 73.0479, address: 'Blue Area, Islamabad' },
        dropoffLocation: { lat: 33.7294, lng: 73.0931, address: 'F-7, Islamabad' },
        status: 'dropped',
        fare: 380,
      },
    ],
    isPooled: false,
    status: 'completed',
    route: [],
    totalFare: 380,
    startTime: '2024-12-30T09:00:00Z',
    endTime: '2024-12-30T09:30:00Z',
    createdAt: '2024-12-30T08:55:00Z',
    updatedAt: '2024-12-30T09:30:00Z',
  },
  {
    id: 'admin-ride-002',
    driverId: 'driver-002',
    passengers: [
      {
        userId: 'user-002',
        pickupLocation: { lat: 33.6501, lng: 73.0156, address: 'G-10, Islamabad' },
        dropoffLocation: { lat: 33.5651, lng: 73.0169, address: 'Rawalpindi' },
        status: 'picked',
        fare: 520,
      },
    ],
    isPooled: true,
    status: 'in-progress',
    route: [],
    totalFare: 520,
    startTime: '2024-12-30T11:00:00Z',
    createdAt: '2024-12-30T10:55:00Z',
    updatedAt: '2024-12-30T11:00:00Z',
  },
  {
    id: 'admin-ride-003',
    driverId: undefined,
    passengers: [
      {
        userId: 'user-003',
        pickupLocation: { lat: 33.7047, lng: 73.0594, address: 'F-6, Islamabad' },
        dropoffLocation: { lat: 33.6844, lng: 73.0479, address: 'Blue Area, Islamabad' },
        status: 'pending',
        fare: 290,
      },
    ],
    isPooled: false,
    status: 'requested',
    route: [],
    totalFare: 290,
    createdAt: '2024-12-30T11:30:00Z',
    updatedAt: '2024-12-30T11:30:00Z',
  },
];

// Nearby drivers for map
export const DUMMY_NEARBY_DRIVERS: NearbyDriver[] = [
  {
    driverId: 'driver-001',
    userId: 'driver-user-001',
    name: 'Ali Raza',
    vehicleType: 'Sedan',
    vehicleNumber: 'LEA-5678',
    rating: 4.7,
    totalTrips: 127,
    distance: 1.2,
    location: { lat: 33.6900, lng: 73.0500 },
  },
  {
    driverId: 'driver-002',
    userId: 'driver-user-002',
    name: 'Hamza Iqbal',
    vehicleType: 'SUV',
    vehicleNumber: 'LEA-1234',
    rating: 4.8,
    totalTrips: 203,
    distance: 2.5,
    location: { lat: 33.6750, lng: 73.0400 },
  },
  {
    driverId: 'driver-003',
    userId: 'driver-user-003',
    name: 'Faisal Mahmood',
    vehicleType: 'Mini-Van',
    vehicleNumber: 'LEA-9012',
    rating: 4.5,
    totalTrips: 89,
    distance: 3.1,
    location: { lat: 33.7000, lng: 73.0600 },
  },
];

// Fare calculation helper
export const calculateDummyFare = (pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number, wantPooling: boolean): FareInfo => {
  // Calculate distance using Haversine formula
  const R = 6371; // Earth's radius in kilometers
  const dLat = (dropoffLat - pickupLat) * Math.PI / 180;
  const dLng = (dropoffLng - pickupLng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(pickupLat * Math.PI / 180) * Math.cos(dropoffLat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Math.round(R * c * 10) / 10;

  const baseFare = 100;
  const perKmRate = 35;
  const distanceFare = distance * perKmRate;
  const subtotal = baseFare + distanceFare;
  const discount = wantPooling ? Math.round(subtotal * 0.25) : 0;
  const totalFare = subtotal - discount;

  return {
    distance,
    baseFare,
    distanceFare: Math.round(distanceFare),
    discount,
    totalFare: Math.round(totalFare),
  };
};

// Admin user list
export const DUMMY_ALL_USERS: User[] = [
  DUMMY_USERS['user1@ridepool.pk'],
  DUMMY_USERS['driver1@ridepool.pk'],
  DUMMY_USERS['admin1@ridepool.pk'],
  {
    id: 'user-002',
    name: 'Fatima Ali',
    email: 'user2@ridepool.pk',
    phone: '+923002222222',
    role: 'user',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-12-20T12:00:00Z',
  },
  {
    id: 'user-003',
    name: 'Muhammad Hassan',
    email: 'user3@ridepool.pk',
    phone: '+923003333333',
    role: 'user',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-12-22T12:00:00Z',
  },
  {
    id: 'driver-002',
    name: 'Hamza Iqbal',
    email: 'driver2@ridepool.pk',
    phone: '+923108888888',
    role: 'driver',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-12-25T12:00:00Z',
  },
];

// Feedback data for admin
export const DUMMY_FEEDBACK: Feedback[] = [
  {
    id: 'feedback-001',
    userId: 'user-001',
    rideId: 'ride-d001',
    driverId: 'driver-001',
    rating: 5,
    comment: 'Excellent service! Driver was very professional.',
    createdAt: '2024-12-29T11:00:00Z',
    userName: 'Ahmed Khan',
    driverName: 'Ali Raza',
  },
  {
    id: 'feedback-002',
    userId: 'user-002',
    rideId: 'ride-d002',
    driverId: 'driver-001',
    rating: 4,
    comment: 'Good ride, arrived on time.',
    createdAt: '2024-12-28T16:00:00Z',
    userName: 'Fatima Ali',
    driverName: 'Ali Raza',
  },
  {
    id: 'feedback-003',
    userId: 'user-003',
    rideId: 'ride-d003',
    driverId: 'driver-002',
    rating: 5,
    comment: 'Very comfortable journey!',
    createdAt: '2024-12-27T19:00:00Z',
    userName: 'Muhammad Hassan',
    driverName: 'Hamza Iqbal',
  },
];

// Payment data for admin
export const DUMMY_PAYMENT_SUMMARY: PaymentSummary = {
  totalRides: 1247,
  completedRides: 1185,
  pooledRides: 423,
  totalRevenue: 2456780,
  averageFare: 2073,
};

export const DUMMY_PAYMENTS: Payment[] = [
  {
    rideId: 'ride-d001',
    totalFare: 350,
    isPooled: false,
    passengerCount: 1,
    completedAt: '2024-12-29T10:35:00Z',
    driverName: 'Ali Raza',
  },
  {
    rideId: 'ride-d002',
    totalFare: 900,
    isPooled: true,
    passengerCount: 2,
    completedAt: '2024-12-28T15:00:00Z',
    driverName: 'Ali Raza',
  },
  {
    rideId: 'ride-d003',
    totalFare: 250,
    isPooled: false,
    passengerCount: 1,
    completedAt: '2024-12-27T18:25:00Z',
    driverName: 'Ali Raza',
  },
  {
    rideId: 'admin-ride-001',
    totalFare: 380,
    isPooled: false,
    passengerCount: 1,
    completedAt: '2024-12-30T09:30:00Z',
    driverName: 'Ali Raza',
  },
];
