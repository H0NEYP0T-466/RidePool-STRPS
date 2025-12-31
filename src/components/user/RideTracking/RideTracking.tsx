import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../../services/api';
import socketService from '../../../services/socket';
import Button from '../../common/Button/Button';
import { formatCurrency, getStatusColor } from '../../../utils/helpers';
import { DEFAULT_CENTER } from '../../../utils/constants';
import type { Booking, LocationUpdateEvent } from '../../../types';
import './RideTracking.css';

interface RideDetails {
  booking: Booking;
  ride?: {
    id: string;
    status: string;
    isPooled: boolean;
    totalFare: number;
    driver?: {
      name: string;
      vehicleType: string;
      vehicleNumber: string;
      rating: number;
      currentLocation?: { lat: number; lng: number };
    };
  };
}

const RideTracking = () => {
  const [activeRide, setActiveRide] = useState<RideDetails | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const fetchActiveRide = async () => {
      try {
        const response = await api.get('/api/user/rides', {
          params: { status: 'in-progress', limit: 1 },
        });
        const rides = response.data.data.rides || [];

        if (rides.length > 0) {
          const rideDetails = await api.get(`/api/user/rides/${rides[0].id}`);
          setActiveRide(rideDetails.data.data);

          if (rideDetails.data.data.ride?.driver?.currentLocation) {
            setDriverLocation(rideDetails.data.data.ride.driver.currentLocation);
          }

          // Join ride room for real-time updates
          if (rideDetails.data.data.ride?.id) {
            socketService.joinRideRoom(rideDetails.data.data.ride.id);
          }
        } else {
          // Check for matched/accepted rides
          const matchedResponse = await api.get('/api/user/rides', {
            params: { status: 'matched', limit: 1 },
          });
          const matchedRides = matchedResponse.data.data.rides || [];

          if (matchedRides.length > 0) {
            const rideDetails = await api.get(`/api/user/rides/${matchedRides[0].id}`);
            setActiveRide(rideDetails.data.data);

            if (rideDetails.data.data.ride?.id) {
              socketService.joinRideRoom(rideDetails.data.data.ride.id);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch active ride:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveRide();

    // Listen for driver location updates
    socketService.onDriverLocation((data: LocationUpdateEvent) => {
      setDriverLocation({ lat: data.lat, lng: data.lng });
    });

    return () => {
      socketService.offDriverLocation();
      if (activeRide?.ride?.id) {
        socketService.leaveRideRoom(activeRide.ride.id);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        12
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map with ride locations and driver position
  useEffect(() => {
    if (!mapRef.current || !activeRide) return;

    // Clear existing layers except tile layer
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapRef.current?.removeLayer(layer);
      }
    });

    const { booking } = activeRide;

    // Add pickup marker
    const pickupIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; border: 3px solid white;"></div>',
      iconSize: [20, 20],
    });
    L.marker([booking.pickupLocation.lat, booking.pickupLocation.lng], { icon: pickupIcon })
      .bindPopup('Pickup')
      .addTo(mapRef.current);

    // Add dropoff marker
    const dropoffIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width: 20px; height: 20px; background: #ef4444; border-radius: 50%; border: 3px solid white;"></div>',
      iconSize: [20, 20],
    });
    L.marker([booking.dropoffLocation.lat, booking.dropoffLocation.lng], { icon: dropoffIcon })
      .bindPopup('Dropoff')
      .addTo(mapRef.current);

    // Add driver marker
    if (driverLocation) {
      const driverIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 30px; height: 30px; background: #00d4ff; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px;">🚗</div>',
        iconSize: [30, 30],
      });
      driverMarkerRef.current = L.marker([driverLocation.lat, driverLocation.lng], { icon: driverIcon })
        .bindPopup('Driver')
        .addTo(mapRef.current);
    }

    // Draw route
    const points: L.LatLngExpression[] = [
      [booking.pickupLocation.lat, booking.pickupLocation.lng],
    ];
    if (driverLocation) {
      points.unshift([driverLocation.lat, driverLocation.lng]);
    }
    points.push([booking.dropoffLocation.lat, booking.dropoffLocation.lng]);

    L.polyline(points, { color: '#00d4ff', weight: 4 }).addTo(mapRef.current);

    // Fit bounds
    mapRef.current.fitBounds(points as L.LatLngBoundsExpression, { padding: [50, 50] });
  }, [activeRide, driverLocation]);

  if (isLoading) {
    return (
      <div className="ride-tracking">
        <div className="tracking-header">
          <h1>Track Your Ride</h1>
        </div>
        <div className="no-active-ride">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!activeRide) {
    return (
      <div className="ride-tracking">
        <div className="tracking-header">
          <h1>Track Your Ride</h1>
        </div>
        <div className="no-active-ride">
          <h2>No Active Ride</h2>
          <p>You don't have any active rides to track</p>
          <Link to="/user/book">
            <Button>Book a Ride</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { booking, ride } = activeRide;

  return (
    <div className="ride-tracking">
      <div className="tracking-header">
        <h1>Track Your Ride</h1>
        <p>Live tracking of your current ride</p>
      </div>

      <div className="tracking-content">
        <div className="tracking-info">
          <div className="ride-status-section">
            <div className="status-indicator">
              <div
                className="status-dot"
                style={{ backgroundColor: getStatusColor(booking.status) }}
              />
              <div className="status-text">
                <h3>{booking.status === 'matched' ? 'Driver Assigned' : 'Ride In Progress'}</h3>
                <p>
                  {booking.status === 'matched'
                    ? 'Your driver is on the way'
                    : 'You are on your way to destination'}
                </p>
              </div>
            </div>
          </div>

          {ride?.driver && (
            <div className="driver-info">
              <div className="driver-avatar">{ride.driver.name.charAt(0)}</div>
              <div className="driver-details">
                <h4>{ride.driver.name}</h4>
                <p>{ride.driver.vehicleType} • {ride.driver.vehicleNumber}</p>
                <p className="rating">⭐ {ride.driver.rating.toFixed(1)}</p>
              </div>
            </div>
          )}

          <div className="trip-details">
            <h4>Trip Details</h4>
            <div className="trip-location">
              <div className="location-marker pickup" />
              <div>
                <p>{booking.pickupLocation.address || 'Pickup Location'}</p>
                <span>Pickup</span>
              </div>
            </div>
            <div className="trip-location">
              <div className="location-marker dropoff" />
              <div>
                <p>{booking.dropoffLocation.address || 'Dropoff Location'}</p>
                <span>Dropoff</span>
              </div>
            </div>
          </div>

          <div className="trip-fare">
            <span>Estimated Fare</span>
            <strong>{formatCurrency(booking.fare)}</strong>
          </div>
        </div>

        <div className="tracking-map">
          <div ref={mapContainerRef} style={{ height: '100%', minHeight: '500px' }} />
        </div>
      </div>
    </div>
  );
};

export default RideTracking;
