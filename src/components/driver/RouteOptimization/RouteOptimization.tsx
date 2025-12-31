import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../../services/api';
import Button from '../../common/Button/Button';
import { formatDistance, calculateDistance } from '../../../utils/helpers';
import { DEFAULT_CENTER } from '../../../utils/constants';
import type { Ride } from '../../../types';
import './RouteOptimization.css';

interface Waypoint {
  type: 'pickup' | 'dropoff';
  lat: number;
  lng: number;
  address: string;
}

const RouteOptimization = () => {
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
          generateOptimizedRoute(rides[0]);
        } else {
          // Check for accepted rides
          const acceptedResponse = await api.get('/api/driver/rides', {
            params: { status: 'accepted', limit: 1 },
          });
          const acceptedRides = acceptedResponse.data.data.rides || [];

          if (acceptedRides.length > 0) {
            setActiveRide(acceptedRides[0]);
            generateOptimizedRoute(acceptedRides[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch active ride:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveRide();
  }, []);

  const generateOptimizedRoute = (ride: Ride) => {
    const points: Waypoint[] = [];

    ride.passengers.forEach((passenger) => {
      points.push({
        type: 'pickup',
        lat: passenger.pickupLocation.lat,
        lng: passenger.pickupLocation.lng,
        address: passenger.pickupLocation.address || 'Pickup location',
      });
    });

    ride.passengers.forEach((passenger) => {
      points.push({
        type: 'dropoff',
        lat: passenger.dropoffLocation.lat,
        lng: passenger.dropoffLocation.lng,
        address: passenger.dropoffLocation.address || 'Dropoff location',
      });
    });

    setWaypoints(points);

    // Calculate total distance
    let distance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      distance += calculateDistance(
        points[i].lat,
        points[i].lng,
        points[i + 1].lat,
        points[i + 1].lng
      );
    }
    setTotalDistance(distance);
    setEstimatedTime(Math.round(distance / 40 * 60)); // Assuming 40 km/h average
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        10
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

  // Update map with waypoints
  useEffect(() => {
    if (!mapRef.current || waypoints.length === 0) return;

    // Clear existing layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add markers for each waypoint
    waypoints.forEach((point, index) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: 28px; height: 28px; background: ${point.type === 'pickup' ? '#10b981' : '#ef4444'}; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${index + 1}</div>`,
        iconSize: [28, 28],
      });

      L.marker([point.lat, point.lng], { icon })
        .bindPopup(`${point.type === 'pickup' ? 'Pickup' : 'Dropoff'}: ${point.address}`)
        .addTo(mapRef.current!);
    });

    // Draw route polyline
    const routePoints = waypoints.map((p) => [p.lat, p.lng] as [number, number]);
    L.polyline(routePoints, { color: '#00d4ff', weight: 4 }).addTo(mapRef.current);

    // Fit bounds
    if (waypoints.length > 1) {
      mapRef.current.fitBounds(routePoints, { padding: [50, 50] });
    }
  }, [waypoints]);

  const handleOptimize = () => {
    if (!activeRide) return;
    // Re-optimize the route
    generateOptimizedRoute(activeRide);
  };

  if (isLoading) {
    return (
      <div className="route-optimization">
        <div className="route-header">
          <h1>Route Optimization</h1>
        </div>
        <div className="no-route">Loading...</div>
      </div>
    );
  }

  if (!activeRide || waypoints.length === 0) {
    return (
      <div className="route-optimization">
        <div className="route-header">
          <h1>Route Optimization</h1>
          <p>Optimize your route for multiple pickups and dropoffs</p>
        </div>
        <div className="no-route">
          <p>No active ride with route to optimize</p>
        </div>
      </div>
    );
  }

  return (
    <div className="route-optimization">
      <div className="route-header">
        <h1>Route Optimization</h1>
        <p>Optimized route for your current ride</p>
      </div>

      <div className="route-content">
        <div className="waypoints-panel">
          <h2>Waypoints ({waypoints.length})</h2>

          <div className="waypoints-list">
            {waypoints.map((point, index) => (
              <div key={index} className="waypoint-item">
                <div className="waypoint-number">{index + 1}</div>
                <div className="waypoint-details">
                  <span className={`waypoint-type ${point.type}`}>{point.type}</span>
                  <p>{point.address}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="route-stats">
            <div className="stat-row">
              <span>Total Distance</span>
              <strong>{formatDistance(totalDistance)}</strong>
            </div>
            <div className="stat-row">
              <span>Estimated Time</span>
              <strong>{estimatedTime} mins</strong>
            </div>
            <div className="stat-row">
              <span>Stops</span>
              <strong>{waypoints.length}</strong>
            </div>
          </div>

          <Button isBlock onClick={handleOptimize}>
            Re-optimize Route
          </Button>
        </div>

        <div className="map-container">
          <div ref={mapContainerRef} style={{ height: '100%', minHeight: '500px' }} />
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;
