import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button/Button';
import { formatCurrency, formatDate, getStatusColor } from '../../../utils/helpers';
import type { RideRequest, Ride } from '../../../types';
import './DriverDashboard.css';

interface DriverProfile {
  driver: {
    id: string;
    isAvailable: boolean;
    rating: number;
    totalTrips: number;
    vehicleType: string;
    vehicleNumber: string;
  };
}

const DriverDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [pendingRequests, setPendingRequests] = useState<RideRequest[]>([]);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    weeklyEarnings: 0,
    totalEarnings: 0,
    completedToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch driver profile
        const profileRes = await api.get('/api/driver/profile');
        setProfile(profileRes.data.data);

        // Fetch pending ride requests
        const requestsRes = await api.get('/api/driver/ride-requests', { params: { limit: 3 } });
        setPendingRequests(requestsRes.data.data.requests || []);

        // Fetch recent rides
        const ridesRes = await api.get('/api/driver/rides', { params: { limit: 5 } });
        const rides = ridesRes.data.data.rides || [];
        setRecentRides(rides);

        // Calculate stats
        const completed = rides.filter((r: Ride) => r.status === 'completed');
        const totalEarnings = completed.reduce((sum: number, r: Ride) => sum + r.totalFare, 0);

        setStats({
          todayEarnings: totalEarnings * 0.3, // Simulated
          weeklyEarnings: totalEarnings * 0.7, // Simulated
          totalEarnings,
          completedToday: Math.min(completed.length, 3), // Simulated
        });
      } catch (error) {
        console.error('Failed to fetch driver data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    if (!profile) return;

    try {
      // This would normally update availability via API
      setProfile({
        ...profile,
        driver: { ...profile.driver, isAvailable: !profile.driver.isAvailable },
      });
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  const handleAcceptRide = async (bookingId: string) => {
    try {
      await api.post(`/api/driver/ride/${bookingId}/accept`);
      setPendingRequests((prev) => prev.filter((r) => r.bookingId !== bookingId));
    } catch (error) {
      console.error('Failed to accept ride:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="driver-dashboard">
        <div className="empty-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Driver Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
        <div className="availability-toggle">
          <span>{profile?.driver.isAvailable ? 'Online' : 'Offline'}</span>
          <div
            className={`toggle-switch ${profile?.driver.isAvailable ? 'active' : ''}`}
            onClick={handleToggleAvailability}
          />
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>⭐ {profile?.driver.rating.toFixed(1) || '0.0'}</h3>
          <p>Rating</p>
        </div>
        <div className="stat-card">
          <h3>{profile?.driver.totalTrips || 0}</h3>
          <p>Total Trips</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedToday}</h3>
          <p>Completed Today</p>
        </div>
        <div className="stat-card">
          <h3>{formatCurrency(stats.todayEarnings)}</h3>
          <p>Today's Earnings</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Pending Ride Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="requests-list">
              {pendingRequests.map((request) => (
                <div key={request.bookingId} className="request-card">
                  <div className="request-header">
                    <h4>{request.userName}</h4>
                    <span className="request-fare">{formatCurrency(request.fare)}</span>
                  </div>
                  <div className="request-location">
                    <div className="location-dot pickup" />
                    <p>{request.pickupLocation.address || 'Pickup location'}</p>
                  </div>
                  <div className="request-location">
                    <div className="location-dot dropoff" />
                    <p>{request.dropoffLocation.address || 'Dropoff location'}</p>
                  </div>
                  <div className="request-actions">
                    <Button size="sm" onClick={() => handleAcceptRide(request.bookingId)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="secondary">
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending ride requests</p>
            </div>
          )}
          <div style={{ marginTop: '1rem' }}>
            <Link to="/driver/requests">
              <Button variant="outline" isBlock>
                View All Requests
              </Button>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Earnings Summary</h2>
          <div className="earnings-summary">
            <div className="earning-row">
              <span>Today</span>
              <strong>{formatCurrency(stats.todayEarnings)}</strong>
            </div>
            <div className="earning-row">
              <span>This Week</span>
              <strong>{formatCurrency(stats.weeklyEarnings)}</strong>
            </div>
            <div className="earning-row total">
              <span>Total Earnings</span>
              <strong>{formatCurrency(stats.totalEarnings)}</strong>
            </div>
          </div>

          <h3 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1rem' }}>Recent Trips</h3>
          {recentRides.length > 0 ? (
            <ul className="recent-trips">
              {recentRides.slice(0, 3).map((ride) => (
                <li key={ride.id} className="trip-item">
                  <div
                    className="trip-status"
                    style={{ backgroundColor: getStatusColor(ride.status) }}
                  />
                  <div className="trip-info">
                    <h4>{ride.passengers[0]?.pickupLocation.address || 'Trip'}</h4>
                    <p>{formatDate(ride.createdAt)}</p>
                  </div>
                  <span className="trip-fare">{formatCurrency(ride.totalFare)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">No recent trips</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
