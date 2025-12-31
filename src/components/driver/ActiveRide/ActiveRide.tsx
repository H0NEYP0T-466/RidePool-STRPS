import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../../services/api';
import socketService from '../../../services/socket';
import Button from '../../common/Button/Button';
import { formatCurrency, getStatusColor } from '../../../utils/helpers';
import { DEFAULT_CENTER } from '../../../utils/constants';
import type { Ride } from '../../../types';
import './ActiveRide.css';

const ActiveRide = () => {
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchActiveRide = async () => {
      try {
        const response = await api.get('/api/driver/rides', {
          params: { status: 'in-progress', limit: 1 },
        });
        const rides = response.data.data.rides || [];

        if (rides.length > 0) {
          setActiveRide(rides[0]);
          socketService.joinRideRoom(rides[0].id);
        } else {
          // Check for accepted rides
          const acceptedResponse = await api.get('/api/driver/rides', {
            params: { status: 'accepted', limit: 1 },
          });
          const acceptedRides = acceptedResponse.data.data.rides || [];

          if (acceptedRides.length > 0) {
            setActiveRide(acceptedRides[0]);
            socketService.joinRideRoom(acceptedRides[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch active ride:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveRide();

    return () => {
      if (activeRide?.id) {
        socketService.leaveRideRoom(activeRide.id);
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

  // Update map with ride locations
  useEffect(() => {
    if (!mapRef.current || !activeRide) return;

    // Clear existing layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapRef.current?.removeLayer(layer);
      }
    });

    const passenger = activeRide.passengers[0];
    if (!passenger) return;

    // Add pickup marker
    const pickupIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; border: 3px solid white;"></div>',
      iconSize: [20, 20],
    });
    L.marker([passenger.pickupLocation.lat, passenger.pickupLocation.lng], { icon: pickupIcon })
      .bindPopup('Pickup')
      .addTo(mapRef.current);

    // Add dropoff marker
    const dropoffIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="width: 20px; height: 20px; background: #ef4444; border-radius: 50%; border: 3px solid white;"></div>',
      iconSize: [20, 20],
    });
    L.marker([passenger.dropoffLocation.lat, passenger.dropoffLocation.lng], { icon: dropoffIcon })
      .bindPopup('Dropoff')
      .addTo(mapRef.current);

    // Draw route
    L.polyline(
      [
        [passenger.pickupLocation.lat, passenger.pickupLocation.lng],
        [passenger.dropoffLocation.lat, passenger.dropoffLocation.lng],
      ],
      { color: '#00d4ff', weight: 4 }
    ).addTo(mapRef.current);

    // Fit bounds
    mapRef.current.fitBounds([
      [passenger.pickupLocation.lat, passenger.pickupLocation.lng],
      [passenger.dropoffLocation.lat, passenger.dropoffLocation.lng],
    ], { padding: [50, 50] });
  }, [activeRide]);

  const handleUpdateStatus = async (status: string) => {
    if (!activeRide) return;

    setIsUpdating(true);
    try {
      await api.put(`/api/driver/ride/${activeRide.id}/status`, null, {
        params: { status },
      });

      if (status === 'completed' || status === 'cancelled') {
        setActiveRide(null);
      } else {
        setActiveRide({ ...activeRide, status: status as Ride['status'] });
      }

      // Emit socket event
      socketService.updateRideStatus(activeRide.id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="active-ride">
        <div className="active-header">
          <h1>Active Ride</h1>
        </div>
        <div className="no-active-ride">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!activeRide) {
    return (
      <div className="active-ride">
        <div className="active-header">
          <h1>Active Ride</h1>
        </div>
        <div className="no-active-ride">
          <h2>No Active Ride</h2>
          <p>Accept a ride request to get started</p>
          <Link to="/driver/requests">
            <Button>View Ride Requests</Button>
          </Link>
        </div>
      </div>
    );
  }

  const passenger = activeRide.passengers[0];

  return (
    <div className="active-ride">
      <div className="active-header">
        <h1>Active Ride</h1>
        <p>Manage your current ride</p>
      </div>

      <div className="active-content">
        <div className="ride-panel">
          <div className="status-section">
            <div
              className="status-badge"
              style={{
                backgroundColor: `${getStatusColor(activeRide.status)}20`,
                color: getStatusColor(activeRide.status),
              }}
            >
              <div
                className="status-dot"
                style={{ backgroundColor: getStatusColor(activeRide.status) }}
              />
              {activeRide.status === 'accepted'
                ? 'Going to Pickup'
                : activeRide.status === 'in-progress'
                ? 'Trip In Progress'
                : activeRide.status}
            </div>

            <div className="status-actions">
              {activeRide.status === 'accepted' && (
                <Button
                  isBlock
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('in-progress')}
                >
                  Start Trip
                </Button>
              )}
              {activeRide.status === 'in-progress' && (
                <Button
                  isBlock
                  variant="success"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('completed')}
                >
                  Complete Trip
                </Button>
              )}
              <Button
                isBlock
                variant="danger"
                isLoading={isUpdating}
                onClick={() => handleUpdateStatus('cancelled')}
              >
                Cancel Ride
              </Button>
            </div>
          </div>

          {passenger && (
            <div className="passenger-info">
              <div className="passenger-header">
                <div className="passenger-avatar">👤</div>
                <div className="passenger-details">
                  <h3>Passenger</h3>
                  <p>
                    {passenger.status === 'pending'
                      ? 'Waiting for pickup'
                      : passenger.status === 'picked'
                      ? 'On board'
                      : 'Dropped off'}
                  </p>
                </div>
              </div>

              <div className="passenger-locations">
                <h4>Trip Details</h4>
                <div className="location-item">
                  <div className="location-marker pickup" />
                  <div>
                    <p>{passenger.pickupLocation.address || 'Pickup location'}</p>
                    <span>Pickup</span>
                  </div>
                </div>
                <div className="location-item">
                  <div className="location-marker dropoff" />
                  <div>
                    <p>{passenger.dropoffLocation.address || 'Dropoff location'}</p>
                    <span>Dropoff</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="fare-section">
            <h4>Trip Fare</h4>
            <div className="fare-amount">{formatCurrency(activeRide.totalFare)}</div>
          </div>
        </div>

        <div className="map-container">
          <div ref={mapContainerRef} style={{ height: '100%', minHeight: '500px' }} />
        </div>
      </div>
    </div>
  );
};

export default ActiveRide;
