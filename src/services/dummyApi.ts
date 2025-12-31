/**
 * Dummy API service for frontend-only mode
 * Provides mock responses when backend is unavailable
 */

import { getUser } from '../utils/helpers';
import {
  DUMMY_USER_RIDES,
  DUMMY_RIDE_REQUESTS,
  DUMMY_DRIVER_RIDES,
  DUMMY_DRIVER_PROFILE,
  DUMMY_AVAILABLE_POOLS,
  DUMMY_ADMIN_METRICS,
  DUMMY_ADMIN_RECENT_RIDES,
  DUMMY_ALL_USERS,
  DUMMY_NEARBY_DRIVERS,
  DUMMY_FEEDBACK,
  DUMMY_PAYMENT_SUMMARY,
  DUMMY_PAYMENTS,
  calculateDummyFare,
} from '../data/dummyData';
import type { AvailablePool } from '../data/dummyData';

// Simulated API response wrapper
const createResponse = <T>(data: T) => ({
  data: {
    success: true,
    data,
  },
});

// Check if user is driver or admin
const isDriverOrAdmin = () => {
  const user = getUser();
  return user?.role === 'driver' || user?.role === 'admin';
};

const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

// Dummy API handlers
export const dummyApiHandlers: Record<string, (params?: Record<string, unknown>) => unknown> = {
  // User rides
  'GET /api/user/rides': (params) => {
    const status = params?.status as string | undefined;
    let rides = [...DUMMY_USER_RIDES];
    if (status) {
      rides = rides.filter(r => r.status === status);
    }
    return createResponse({
      rides,
      pagination: {
        page: 1,
        limit: 10,
        total: rides.length,
        pages: 1,
      },
    });
  },

  // Driver profile
  'GET /api/driver/profile': () => {
    const user = getUser();
    return createResponse({
      driver: DUMMY_DRIVER_PROFILE,
      user,
    });
  },

  // Driver ride requests (both pooled and non-pooled)
  'GET /api/driver/ride-requests': () => {
    if (!isDriverOrAdmin()) {
      throw new Error('Access denied');
    }
    return createResponse({
      requests: DUMMY_RIDE_REQUESTS,
      pagination: {
        page: 1,
        limit: 10,
        total: DUMMY_RIDE_REQUESTS.length,
        pages: 1,
      },
    });
  },

  // Driver rides (history)
  'GET /api/driver/rides': () => {
    if (!isDriverOrAdmin()) {
      throw new Error('Access denied');
    }
    return createResponse({
      rides: DUMMY_DRIVER_RIDES,
      pagination: {
        page: 1,
        limit: 10,
        total: DUMMY_DRIVER_RIDES.length,
        pages: 1,
      },
    });
  },

  // Available pools
  'GET /api/rides/available-pools': () => {
    return createResponse({
      pools: DUMMY_AVAILABLE_POOLS,
    });
  },

  // Nearby drivers
  'GET /api/rides/nearby-drivers': () => {
    return createResponse({
      drivers: DUMMY_NEARBY_DRIVERS,
    });
  },

  // Admin dashboard
  'GET /api/admin/dashboard': () => {
    if (!isAdmin()) {
      throw new Error('Access denied');
    }
    return createResponse({
      metrics: DUMMY_ADMIN_METRICS,
      recentRides: DUMMY_ADMIN_RECENT_RIDES,
    });
  },

  // Admin users
  'GET /api/admin/users': () => {
    if (!isAdmin()) {
      throw new Error('Access denied');
    }
    return createResponse({
      users: DUMMY_ALL_USERS.filter(u => u.role === 'user'),
      pagination: {
        page: 1,
        limit: 10,
        total: DUMMY_ALL_USERS.filter(u => u.role === 'user').length,
        pages: 1,
      },
    });
  },

  // Admin drivers
  'GET /api/admin/drivers': () => {
    if (!isAdmin()) {
      throw new Error('Access denied');
    }
    return createResponse({
      drivers: DUMMY_ALL_USERS.filter(u => u.role === 'driver'),
      pagination: {
        page: 1,
        limit: 10,
        total: DUMMY_ALL_USERS.filter(u => u.role === 'driver').length,
        pages: 1,
      },
    });
  },

  // Admin trips
  'GET /api/admin/trips': () => {
    if (!isAdmin()) {
      throw new Error('Access denied');
    }
    return createResponse({
      rides: [...DUMMY_ADMIN_RECENT_RIDES, ...DUMMY_DRIVER_RIDES],
      pagination: {
        page: 1,
        limit: 10,
        total: DUMMY_ADMIN_RECENT_RIDES.length + DUMMY_DRIVER_RIDES.length,
        pages: 1,
      },
    });
  },

  // Admin feedback
  'GET /api/admin/feedback': () => {
    if (!isAdmin()) {
      throw new Error('Access denied');
    }
    return createResponse({
      feedback: DUMMY_FEEDBACK,
      pagination: {
        page: 1,
        limit: 10,
        total: DUMMY_FEEDBACK.length,
        pages: 1,
      },
    });
  },

  // Admin payments
  'GET /api/admin/payments': () => {
    if (!isAdmin()) {
      throw new Error('Access denied');
    }
    return createResponse({
      summary: DUMMY_PAYMENT_SUMMARY,
      payments: DUMMY_PAYMENTS,
      pagination: {
        page: 1,
        limit: 10,
        total: DUMMY_PAYMENTS.length,
        pages: 1,
      },
    });
  },

  // Active ride for driver
  'GET /api/driver/active-ride': () => {
    // Return the first in-progress ride or null
    const activeRide = DUMMY_DRIVER_RIDES.find(r => r.status === 'in-progress' || r.status === 'accepted');
    return createResponse({
      ride: activeRide || null,
    });
  },

  // User request ride
  'POST /api/user/ride/request': (params) => {
    const pickupLocation = params?.pickupLocation as { lat: number; lng: number; address?: string };
    const dropoffLocation = params?.dropoffLocation as { lat: number; lng: number; address?: string };
    const wantPooling = params?.wantPooling as boolean;
    
    const fareInfo = calculateDummyFare(
      pickupLocation.lat,
      pickupLocation.lng,
      dropoffLocation.lat,
      dropoffLocation.lng,
      wantPooling
    );

    return createResponse({
      bookingId: 'demo-booking-' + Date.now(),
      userId: getUser()?.id,
      pickupLocation,
      dropoffLocation,
      wantPooling,
      status: 'requested',
      fareInfo,
      createdAt: new Date().toISOString(),
    });
  },

  // Driver accept ride
  'POST /api/driver/ride/:bookingId/accept': () => {
    return createResponse({
      rideId: 'demo-ride-' + Date.now(),
      message: 'Ride accepted successfully (demo mode)',
    });
  },

  // Driver reject ride
  'POST /api/driver/ride/:bookingId/reject': () => {
    return createResponse({
      message: 'Ride rejected (demo mode)',
    });
  },

  // Update driver availability
  'PUT /api/driver/profile': (params) => {
    const isAvailable = params?.isAvailable;
    return createResponse({
      driver: {
        ...DUMMY_DRIVER_PROFILE,
        isAvailable: isAvailable ?? DUMMY_DRIVER_PROFILE.isAvailable,
      },
    });
  },

  // Join pool
  'POST /api/rides/join-pool/:poolId': () => {
    return createResponse({
      message: 'Successfully joined the pool (demo mode)',
    });
  },

  // Get pool info
  'GET /api/rides/pool/:poolId': (params) => {
    const poolId = params?.poolId as string;
    const pool = DUMMY_AVAILABLE_POOLS.find((p: AvailablePool) => p.id === poolId);
    return createResponse({
      pool: pool || DUMMY_AVAILABLE_POOLS[0],
    });
  },
};

// Function to get dummy response for a request
export const getDummyResponse = (method: string, url: string, params?: Record<string, unknown>) => {
  // Normalize the URL
  const normalizedUrl = url.replace(/\/[a-f0-9-]+$/i, '/:id'); // Replace IDs with :id
  const key = `${method.toUpperCase()} ${normalizedUrl}`;
  
  // Try exact match first
  if (dummyApiHandlers[key]) {
    return dummyApiHandlers[key](params);
  }
  
  // Try pattern matching for dynamic routes
  for (const handlerKey of Object.keys(dummyApiHandlers)) {
    const pattern = handlerKey.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(`${method.toUpperCase()} ${url}`)) {
      return dummyApiHandlers[handlerKey](params);
    }
  }
  
  // Default response
  return createResponse({ message: 'Demo mode - operation simulated' });
};
