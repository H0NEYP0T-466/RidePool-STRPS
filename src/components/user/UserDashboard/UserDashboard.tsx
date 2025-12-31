import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../../utils/helpers';
import type { Booking } from '../../../types';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [recentRides, setRecentRides] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalRides: 0,
    completedRides: 0,
    totalSpent: 0,
    savedAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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

    fetchData();
  }, []);

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
