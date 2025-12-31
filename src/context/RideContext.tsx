import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Booking, LocationWithAddress, FareInfo, NearbyDriver, PoolMatch } from '../types';
import api from '../services/api';

interface RideContextType {
  currentBooking: Booking | null;
  pickupLocation: LocationWithAddress | null;
  dropoffLocation: LocationWithAddress | null;
  wantPooling: boolean;
  fareInfo: FareInfo | null;
  nearbyDrivers: NearbyDriver[];
  poolMatches: PoolMatch[];
  isLoading: boolean;
  setPickupLocation: (location: LocationWithAddress | null) => void;
  setDropoffLocation: (location: LocationWithAddress | null) => void;
  setWantPooling: (want: boolean) => void;
  requestRide: () => Promise<Booking>;
  findNearbyDrivers: (lat: number, lng: number) => Promise<void>;
  findPoolMatches: () => Promise<void>;
  cancelRide: (bookingId: string) => Promise<void>;
  clearRide: () => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider = ({ children }: { children: ReactNode }) => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [pickupLocation, setPickupLocation] = useState<LocationWithAddress | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<LocationWithAddress | null>(null);
  const [wantPooling, setWantPooling] = useState(false);
  const [fareInfo, setFareInfo] = useState<FareInfo | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<NearbyDriver[]>([]);
  const [poolMatches, setPoolMatches] = useState<PoolMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const requestRide = async (): Promise<Booking> => {
    if (!pickupLocation || !dropoffLocation) {
      throw new Error('Pickup and dropoff locations are required');
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/user/ride/request', {
        pickupLocation,
        dropoffLocation,
        wantPooling,
      });
      
      const booking = {
        id: response.data.data.bookingId,
        userId: response.data.data.userId,
        pickupLocation: response.data.data.pickupLocation,
        dropoffLocation: response.data.data.dropoffLocation,
        wantPooling: response.data.data.wantPooling,
        status: response.data.data.status,
        fare: response.data.data.fareInfo.totalFare,
        paymentStatus: 'pending' as const,
        createdAt: response.data.data.createdAt,
        updatedAt: response.data.data.createdAt,
      };
      
      setCurrentBooking(booking);
      setFareInfo(response.data.data.fareInfo);
      return booking;
    } finally {
      setIsLoading(false);
    }
  };

  const findNearbyDrivers = async (lat: number, lng: number): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/rides/nearby-drivers', {
        params: { lat, lng, radius: 10 },
      });
      setNearbyDrivers(response.data.data.drivers);
    } finally {
      setIsLoading(false);
    }
  };

  const findPoolMatches = async (): Promise<void> => {
    if (!pickupLocation || !dropoffLocation) return;

    setIsLoading(true);
    try {
      const response = await api.post('/api/rides/match', null, {
        params: {
          pickup_lat: pickupLocation.lat,
          pickup_lng: pickupLocation.lng,
          dropoff_lat: dropoffLocation.lat,
          dropoff_lng: dropoffLocation.lng,
        },
      });
      setPoolMatches(response.data.data.matches);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRide = async (bookingId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await api.put(`/api/user/rides/${bookingId}/cancel`);
      setCurrentBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearRide = (): void => {
    setCurrentBooking(null);
    setPickupLocation(null);
    setDropoffLocation(null);
    setWantPooling(false);
    setFareInfo(null);
    setNearbyDrivers([]);
    setPoolMatches([]);
  };

  return (
    <RideContext.Provider
      value={{
        currentBooking,
        pickupLocation,
        dropoffLocation,
        wantPooling,
        fareInfo,
        nearbyDrivers,
        poolMatches,
        isLoading,
        setPickupLocation,
        setDropoffLocation,
        setWantPooling,
        requestRide,
        findNearbyDrivers,
        findPoolMatches,
        cancelRide,
        clearRide,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRide = (): RideContextType => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

export default RideContext;
