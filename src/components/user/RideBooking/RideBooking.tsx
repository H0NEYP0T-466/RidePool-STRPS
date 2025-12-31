import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRide } from '../../../context/RideContext';
import api from '../../../services/api';
import Button from '../../common/Button/Button';
import LocationSearch from '../../common/LocationSearch/LocationSearch';
import { formatCurrency } from '../../../utils/helpers';
import { DEFAULT_CENTER, PAKISTAN_CITIES } from '../../../utils/constants';
import type { LocationWithAddress, NearbyDriver } from '../../../types';
import './RideBooking.css';

interface PoolInfo {
  id: string;
  type: string;
  pickupLocation: { lat: number; lng: number; address?: string };
  dropoffLocation: { lat: number; lng: number; address?: string };
  currentPassengers: number;
}

const RideBooking = () => {
  const [searchParams] = useSearchParams();
  const joinPoolId = searchParams.get('joinPool');
  
  const {
    pickupLocation,
    dropoffLocation,
    wantPooling,
    fareInfo,
    nearbyDrivers,
    isLoading,
    setPickupLocation,
    setDropoffLocation,
    setWantPooling,
    requestRide,
    findNearbyDrivers,
  } = useRide();

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectingLocation, setSelectingLocation] = useState<'pickup' | 'dropoff' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [joiningPool, setJoiningPool] = useState(false);
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);

  // Fetch pool info if joining a pool
  useEffect(() => {
    if (joinPoolId) {
      setJoiningPool(true);
      // Fetch pool details
      const fetchPoolInfo = async () => {
        try {
          const response = await api.get('/api/rides/available-pools');
          const pools = response.data.data.pools || [];
          const pool = pools.find((p: PoolInfo) => p.id === joinPoolId);
          if (pool) {
            setPoolInfo(pool);
            setWantPooling(true);
          }
        } catch (error) {
          console.error('Failed to fetch pool info:', error);
        }
      };
      fetchPoolInfo();
    }
  }, [joinPoolId, setWantPooling]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(
      [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
      10
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // Add markers for cities
    Object.entries(PAKISTAN_CITIES).forEach(([name, coords]) => {
      L.circleMarker([coords.lat, coords.lng], {
        radius: 5,
        color: '#00d4ff',
        fillColor: '#00d4ff',
        fillOpacity: 0.5,
      })
        .bindPopup(name)
        .addTo(mapRef.current!);
    });

    // Click handler for selecting locations
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const location: LocationWithAddress = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        address: `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`,
      };

      if (selectingLocation === 'pickup') {
        setPickupLocation(location);
        setSelectingLocation('dropoff');
        findNearbyDrivers(location.lat, location.lng);
      } else if (selectingLocation === 'dropoff') {
        setDropoffLocation(location);
        setSelectingLocation(null);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add pickup marker
    if (pickupLocation) {
      const pickupIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; border: 3px solid white;"></div>',
        iconSize: [20, 20],
      });
      L.marker([pickupLocation.lat, pickupLocation.lng], { icon: pickupIcon }).addTo(mapRef.current);
    }

    // Add dropoff marker
    if (dropoffLocation) {
      const dropoffIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 20px; height: 20px; background: #ef4444; border-radius: 50%; border: 3px solid white;"></div>',
        iconSize: [20, 20],
      });
      L.marker([dropoffLocation.lat, dropoffLocation.lng], { icon: dropoffIcon }).addTo(mapRef.current);
    }

    // Add driver markers
    nearbyDrivers.forEach((driver: NearbyDriver) => {
      const driverIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 24px; height: 24px; background: #00d4ff; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 12px;">🚗</div>',
        iconSize: [24, 24],
      });
      L.marker([driver.location.lat, driver.location.lng], { icon: driverIcon })
        .bindPopup(`${driver.name} - ${driver.vehicleType}`)
        .addTo(mapRef.current!);
    });

    // Draw route line
    if (pickupLocation && dropoffLocation) {
      L.polyline(
        [
          [pickupLocation.lat, pickupLocation.lng],
          [dropoffLocation.lat, dropoffLocation.lng],
        ],
        { color: '#00d4ff', weight: 3, dashArray: '5, 10' }
      ).addTo(mapRef.current);

      // Fit bounds
      mapRef.current.fitBounds([
        [pickupLocation.lat, pickupLocation.lng],
        [dropoffLocation.lat, dropoffLocation.lng],
      ], { padding: [50, 50] });
    }
  }, [pickupLocation, dropoffLocation, nearbyDrivers]);

  const handleBookRide = async () => {
    setError('');
    setSuccess('');

    if (!pickupLocation || !dropoffLocation) {
      setError('Please select pickup and dropoff locations');
      return;
    }

    try {
      // If joining a pool, use the join-pool endpoint
      if (joiningPool && joinPoolId) {
        await api.post(`/api/rides/join-pool/${joinPoolId}`, null, {
          params: {
            pickup_lat: pickupLocation.lat,
            pickup_lng: pickupLocation.lng,
            dropoff_lat: dropoffLocation.lat,
            dropoff_lng: dropoffLocation.lng,
            pickup_address: pickupLocation.address || '',
            dropoff_address: dropoffLocation.address || '',
          }
        });
        setSuccess('Successfully joined the pool! You will be notified when a driver accepts.');
      } else {
        await requestRide();
        setSuccess('Ride requested successfully! Looking for drivers...');
      }
    } catch {
      setError('Failed to request ride. Please try again.');
    }
  };

  return (
    <div className="ride-booking">
      <div className="booking-header">
        <h1>{joiningPool ? 'Join a Pool' : 'Book a Ride'}</h1>
        <p>{joiningPool ? 'Select your pickup and dropoff to join this pool' : 'Search for locations or select on the map'}</p>
      </div>

      {joiningPool && poolInfo && (
        <div className="pool-info-banner">
          <h3>🚙 Joining Pool</h3>
          <p>
            <strong>From:</strong> {poolInfo.pickupLocation.address || `${poolInfo.pickupLocation.lat.toFixed(4)}, ${poolInfo.pickupLocation.lng.toFixed(4)}`}
          </p>
          <p>
            <strong>To:</strong> {poolInfo.dropoffLocation.address || `${poolInfo.dropoffLocation.lat.toFixed(4)}, ${poolInfo.dropoffLocation.lng.toFixed(4)}`}
          </p>
          <p><strong>Current passengers:</strong> {poolInfo.currentPassengers}/4</p>
        </div>
      )}

      <div className="booking-content">
        <div className="booking-form-container">
          <h2>Trip Details</h2>

          <div className="location-inputs">
            <LocationSearch
              label="Pickup Location"
              placeholder="Search pickup location..."
              value={pickupLocation}
              onChange={(location) => {
                setPickupLocation(location);
                if (location) {
                  findNearbyDrivers(location.lat, location.lng);
                  setSelectingLocation('dropoff');
                } else {
                  setSelectingLocation('pickup');
                }
              }}
              isActive={selectingLocation === 'pickup'}
              onFocus={() => setSelectingLocation('pickup')}
            />

            <LocationSearch
              label="Dropoff Location"
              placeholder="Search dropoff location..."
              value={dropoffLocation}
              onChange={(location) => {
                setDropoffLocation(location);
                if (location) {
                  setSelectingLocation(null);
                } else {
                  setSelectingLocation('dropoff');
                }
              }}
              isActive={selectingLocation === 'dropoff'}
              onFocus={() => setSelectingLocation('dropoff')}
            />
            
            <p className="map-hint">
              💡 Tip: You can also click on the map to select locations
            </p>
          </div>

          <div className="pooling-toggle">
            <div className="pooling-info">
              <h4>Enable Pooling</h4>
              <p>Save up to 25% by sharing your ride</p>
            </div>
            <div
              className={`toggle-switch ${wantPooling ? 'active' : ''}`}
              onClick={() => setWantPooling(!wantPooling)}
            />
          </div>

          {fareInfo && (
            <div className="fare-estimate">
              <h4>Estimated Fare</h4>
              <div className="fare-amount">{formatCurrency(fareInfo.totalFare)}</div>
              <div className="fare-breakdown">
                <div className="fare-line">
                  <span>Base Fare</span>
                  <span>{formatCurrency(fareInfo.baseFare)}</span>
                </div>
                <div className="fare-line">
                  <span>Distance ({fareInfo.distance} km)</span>
                  <span>{formatCurrency(fareInfo.distanceFare)}</span>
                </div>
                {fareInfo.discount > 0 && (
                  <div className="fare-line discount">
                    <span>Pooling Discount</span>
                    <span>-{formatCurrency(fareInfo.discount)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {success}
            </div>
          )}

          <Button
            isBlock
            isLoading={isLoading}
            onClick={handleBookRide}
            disabled={!pickupLocation || !dropoffLocation}
          >
            {joiningPool ? 'Join Pool' : 'Request Ride'}
          </Button>
        </div>

        <div className="map-container">
          <div ref={mapContainerRef} style={{ height: '100%', minHeight: '500px' }} />
        </div>
      </div>

      {nearbyDrivers.length > 0 && (
        <div className="nearby-drivers">
          <h3>Nearby Drivers ({nearbyDrivers.length})</h3>
          <div className="drivers-list">
            {nearbyDrivers.map((driver) => (
              <div key={driver.driverId} className="driver-card">
                <div className="driver-avatar">{driver.name.charAt(0)}</div>
                <div className="driver-details">
                  <h4>{driver.name}</h4>
                  <p>
                    {driver.vehicleType} • {driver.distance.toFixed(1)} km away
                  </p>
                  <p className="driver-rating">⭐ {driver.rating.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RideBooking;
