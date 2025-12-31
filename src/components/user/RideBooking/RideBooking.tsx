import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRide } from '../../../context/RideContext';
import Button from '../../common/Button/Button';
import { formatCurrency } from '../../../utils/helpers';
import { DEFAULT_CENTER, PAKISTAN_CITIES } from '../../../utils/constants';
import type { LocationWithAddress, NearbyDriver } from '../../../types';
import './RideBooking.css';

const RideBooking = () => {
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
      await requestRide();
      setSuccess('Ride requested successfully! Looking for drivers...');
    } catch (err) {
      setError('Failed to request ride. Please try again.');
    }
  };

  return (
    <div className="ride-booking">
      <div className="booking-header">
        <h1>Book a Ride</h1>
        <p>Select your pickup and dropoff locations on the map</p>
      </div>

      <div className="booking-content">
        <div className="booking-form-container">
          <h2>Trip Details</h2>

          <div className="location-inputs">
            <div
              className={`location-input ${selectingLocation === 'pickup' ? 'active' : ''}`}
              onClick={() => setSelectingLocation('pickup')}
            >
              <div className="location-marker pickup" />
              <div className="location-details">
                <span className="location-label">Pickup Location</span>
                <span className="location-address">
                  {pickupLocation?.address || 'Click to select on map'}
                </span>
              </div>
            </div>

            <div
              className={`location-input ${selectingLocation === 'dropoff' ? 'active' : ''}`}
              onClick={() => setSelectingLocation('dropoff')}
            >
              <div className="location-marker dropoff" />
              <div className="location-details">
                <span className="location-label">Dropoff Location</span>
                <span className="location-address">
                  {dropoffLocation?.address || 'Click to select on map'}
                </span>
              </div>
            </div>
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
            Request Ride
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
