import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../../utils/helpers';
import type { Booking } from '../../../types';
import Button from '../../common/Button/Button';
import './UserDashboard.css';

interface AvailablePool {
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

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentRides, setRecentRides] = useState<Booking[]>([]);
  const [availablePools, setAvailablePools] = useState<AvailablePool[]>([]);
  const [stats, setStats] = useState({
    totalRides: 0,
    completedRides: 0,
    totalSpent: 0,
    savedAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPools, setIsLoadingPools] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/user/rides', { params: { limit: 5 } });
        const rides = response.data.data.rides || [];
        setRecentRides(rides);

        const completed = rides.filter((r: Booking) => r.status === 'completed');
        const totalSpent = completed.reduce((sum: number, r: Booking) => sum + r.fare, 0);
        const savedAmount = rides.filter((r: Booking) => r.wantPooling).length * 100; // Estimated savings

        setStats({
          totalRides: response.data.data.pagination?.total || rides.length,
          completedRides: completed.length,
          totalSpent,
          savedAmount,
        });
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAvailablePools = async () => {
      try {
        const response = await api.get('/api/rides/available-pools', { params: { limit: 5 } });
        setAvailablePools(response.data.data.pools || []);
      } catch (error) {
        console.error('Failed to fetch available pools:', error);
      } finally {
        setIsLoadingPools(false);
      }
    };

    fetchData();
    fetchAvailablePools();
  }, []);

  const handleJoinPool = (poolId: string) => {
    navigate(`/user/book?joinPool=${poolId}`);
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Here's your ride activity overview</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalRides}</h3>
          <p>Total Rides</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedRides}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{formatCurrency(stats.totalSpent)}</h3>
          <p>Total Spent</p>
        </div>
        <div className="stat-card">
          <h3>{formatCurrency(stats.savedAmount)}</h3>
          <p>Amount Saved</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/user/book" className="action-card">
              <div className="action-icon">🚗</div>
              <h4>Book a Ride</h4>
              <p>Request a new ride</p>
            </Link>
            <Link to="/user/track" className="action-card">
              <div className="action-icon">📍</div>
              <h4>Track Ride</h4>
              <p>View active ride</p>
            </Link>
            <Link to="/user/history" className="action-card">
              <div className="action-icon">📋</div>
              <h4>Ride History</h4>
              <p>View past rides</p>
            </Link>
            <Link to="/user/profile" className="action-card">
              <div className="action-icon">👤</div>
              <h4>Profile</h4>
              <p>Manage account</p>
            </Link>
          </div>
        </div>

        {/* Available Pools Section */}
        <div className="dashboard-section">
          <h2>🚙 Available Pools</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Join an existing pool and save up to 25% on your fare!
          </p>
          {isLoadingPools ? (
            <div className="empty-state">Loading available pools...</div>
          ) : availablePools.length > 0 ? (
            <div className="pools-list">
              {availablePools.map((pool) => (
                <div key={pool.id} className="pool-card">
                  <div className="pool-header">
                    <div className="pool-type">
                      {pool.type === 'ride' ? '🚕 Active Ride' : '👥 Looking for Pool'}
                    </div>
                    <span className="pool-passengers">
                      {pool.currentPassengers}/{pool.maxPassengers} passengers
                    </span>
                  </div>
                  <div className="pool-locations">
                    <div className="pool-location">
                      <div className="location-dot pickup" />
                      <span>{pool.pickupLocation.address || `${pool.pickupLocation.lat.toFixed(4)}, ${pool.pickupLocation.lng.toFixed(4)}`}</span>
                    </div>
                    <div className="pool-location">
                      <div className="location-dot dropoff" />
                      <span>{pool.dropoffLocation.address || `${pool.dropoffLocation.lat.toFixed(4)}, ${pool.dropoffLocation.lng.toFixed(4)}`}</span>
                    </div>
                  </div>
                  {pool.distance !== null && pool.distance !== undefined && (
                    <div className="pool-distance">{pool.distance} km from you</div>
                  )}
                  {pool.driver && (
                    <div className="pool-driver">
                      Driver: {pool.driver.name} • {pool.driver.vehicleType} • ⭐ {pool.driver.rating.toFixed(1)}
                    </div>
                  )}
                  {pool.userName && (
                    <div className="pool-user">Posted by: {pool.userName}</div>
                  )}
                  <Button size="sm" onClick={() => handleJoinPool(pool.id)} style={{ marginTop: '0.5rem' }}>
                    Join Pool
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pools available right now</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Start a pooled ride and save money when others join!
              </p>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Recent Rides</h2>
          {isLoading ? (
            <div className="empty-state">Loading...</div>
          ) : recentRides.length > 0 ? (
            <ul className="recent-rides">
              {recentRides.map((ride) => (
                <li key={ride.id} className="ride-item">
                  <div
                    className="ride-status"
                    style={{ backgroundColor: getStatusColor(ride.status) }}
                  />
                  <div className="ride-info">
                    <h4>{ride.pickupLocation.address || 'Unknown'}</h4>
                    <p>{formatDate(ride.createdAt)}</p>
                  </div>
                  <div className="ride-fare">{formatCurrency(ride.fare)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No rides yet. Book your first ride!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
