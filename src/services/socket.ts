import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import type { LocationUpdateEvent, RideStatusEvent, NewRideRequestEvent } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private userType: 'user' | 'driver' = 'user';

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        if (this.userId) {
          this.joinRoom(this.userId, this.userType);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(userId: string, type: 'user' | 'driver'): void {
    this.userId = userId;
    this.userType = type;
    if (this.socket?.connected) {
      this.socket.emit('join_room', { userId, type });
    }
  }

  leaveRoom(userId: string, type: 'user' | 'driver'): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', { userId, type });
    }
  }

  joinRideRoom(rideId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_ride_room', { rideId });
    }
  }

  leaveRideRoom(rideId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_ride_room', { rideId });
    }
  }

  updateLocation(driverId: string, lat: number, lng: number, rideId?: string): void {
    if (this.socket?.connected) {
      this.socket.emit('location_update', { driverId, lat, lng, rideId });
    }
  }

  updateRideStatus(rideId: string, status: string): void {
    if (this.socket?.connected) {
      this.socket.emit('ride_status_update', { rideId, status });
    }
  }

  onDriverLocation(callback: (data: LocationUpdateEvent) => void): void {
    this.socket?.on('driver_location', callback);
  }

  offDriverLocation(): void {
    this.socket?.off('driver_location');
  }

  onRideStatusChanged(callback: (data: RideStatusEvent) => void): void {
    this.socket?.on('ride_status_changed', callback);
  }

  offRideStatusChanged(): void {
    this.socket?.off('ride_status_changed');
  }

  onNewRideRequest(callback: (data: NewRideRequestEvent) => void): void {
    this.socket?.on('new_ride_request', callback);
  }

  offNewRideRequest(): void {
    this.socket?.off('new_ride_request');
  }

  onRideAccepted(callback: (data: unknown) => void): void {
    this.socket?.on('ride_accepted', callback);
  }

  offRideAccepted(): void {
    this.socket?.off('ride_accepted');
  }

  onRideStarted(callback: (data: unknown) => void): void {
    this.socket?.on('ride_started', callback);
  }

  offRideStarted(): void {
    this.socket?.off('ride_started');
  }

  onRideCompleted(callback: (data: unknown) => void): void {
    this.socket?.on('ride_completed', callback);
  }

  offRideCompleted(): void {
    this.socket?.off('ride_completed');
  }

  onPoolMatchFound(callback: (data: unknown) => void): void {
    this.socket?.on('pool_match_found', callback);
  }

  offPoolMatchFound(): void {
    this.socket?.off('pool_match_found');
  }
}

export const socketService = new SocketService();
export default socketService;
