import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../../utils/helpers';
import type { DashboardMetrics, Ride } from '../../../types';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/api/admin/dashboard');
        setMetrics(response.data.data.metrics);
        setRecentRides(response.data.data.recentRides || []);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="empty-state">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>System overview and key metrics</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-value">{metrics?.totalUsers || 0}</div>
          <div className="metric-label">Total Users</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🚗</div>
          <div className="metric-value">{metrics?.totalDrivers || 0}</div>
          <div className="metric-label">Total Drivers</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📍</div>
          <div className="metric-value">{metrics?.totalRides || 0}</div>
          <div className="metric-label">Total Rides</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🔄</div>
          <div className="metric-value">{metrics?.activeRides || 0}</div>
          <div className="metric-label">Active Rides</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-value">{metrics?.completedRides || 0}</div>
          <div className="metric-label">Completed</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-value">{formatCurrency(metrics?.totalRevenue || 0)}</div>
          <div className="metric-label">Total Revenue</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-value">{metrics?.averageRating.toFixed(1) || '0.0'}</div>
          <div className="metric-label">Avg Rating</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Rides</h2>
            <Link to="/admin/trips">View All</Link>
          </div>
          {recentRides.length > 0 ? (
            <ul className="recent-list">
              {recentRides.map((ride) => (
                <li key={ride.id} className="recent-item">
                  <div className="item-icon">🚗</div>
                  <div className="item-info">
                    <h4>Ride #{ride.id.slice(-6)}</h4>
                    <p>{formatDate(ride.createdAt)}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: `${getStatusColor(ride.status)}20`,
                      color: getStatusColor(ride.status),
                    }}
                  >
                    {ride.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">No recent rides</div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Stats</h2>
          </div>
          <div className="quick-stats">
            <div className="quick-stat">
              <h4>{((metrics?.completedRides || 0) / (metrics?.totalRides || 1) * 100).toFixed(0)}%</h4>
              <p>Completion Rate</p>
            </div>
            <div className="quick-stat">
              <h4>{formatCurrency((metrics?.totalRevenue || 0) / (metrics?.completedRides || 1))}</h4>
              <p>Avg Fare</p>
            </div>
            <div className="quick-stat">
              <h4>{metrics?.totalDrivers || 0}</h4>
              <p>Active Drivers</p>
            </div>
            <div className="quick-stat">
              <h4>{metrics?.totalUsers || 0}</h4>
              <p>Registered Users</p>
            </div>
          </div>

          <div className="chart-placeholder" style={{ marginTop: '1rem' }}>
            <p>📊 Analytics Chart (Coming Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
