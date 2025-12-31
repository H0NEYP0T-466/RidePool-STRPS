import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import Button from '../../common/Button/Button';
import { formatCurrency, formatDate, getStatusColor } from '../../../utils/helpers';
import type { Booking, Pagination } from '../../../types';
import './RideHistory.css';

const RideHistory = () => {
  const [rides, setRides] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRides = async (page: number = 1, status?: string) => {
    setIsLoading(true);
    try {
      const params: { page: number; limit: number; status?: string } = { page, limit: 10 };
      if (status) params.status = status;

      const response = await api.get('/api/user/rides', { params });
      setRides(response.data.data.rides || []);
      setPagination(response.data.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(1, statusFilter || undefined);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchRides(newPage, statusFilter || undefined);
  };

  const filters = [
    { value: '', label: 'All' },
    { value: 'requested', label: 'Requested' },
    { value: 'matched', label: 'Matched' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="ride-history">
      <div className="history-header">
        <h1>Ride History</h1>
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-tab ${statusFilter === filter.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading rides...</div>
      ) : rides.length > 0 ? (
        <>
          <div className="rides-list">
            {rides.map((ride) => (
              <div key={ride.id} className="ride-card">
                <div className="ride-card-header">
                  <span className="ride-date">{formatDate(ride.createdAt)}</span>
                  <span
                    className="ride-status-badge"
                    style={{
                      backgroundColor: `${getStatusColor(ride.status)}20`,
                      color: getStatusColor(ride.status),
                    }}
                  >
                    {ride.status}
                  </span>
                </div>

                <div className="ride-locations">
                  <div className="location-point">
                    <div className="location-dot pickup" />
                    <div className="location-text">
                      <span>Pickup</span>
                      <p>{ride.pickupLocation.address || `${ride.pickupLocation.lat.toFixed(4)}, ${ride.pickupLocation.lng.toFixed(4)}`}</p>
                    </div>
                  </div>
                  <div className="location-point">
                    <div className="location-dot dropoff" />
                    <div className="location-text">
                      <span>Dropoff</span>
                      <p>{ride.dropoffLocation.address || `${ride.dropoffLocation.lat.toFixed(4)}, ${ride.dropoffLocation.lng.toFixed(4)}`}</p>
                    </div>
                  </div>
                </div>

                <div className="ride-card-footer">
                  <span className="ride-fare">{formatCurrency(ride.fare)}</span>
                  <span className={`ride-pooled ${ride.wantPooling ? 'active' : ''}`}>
                    {ride.wantPooling ? '👥 Pooled' : '👤 Solo'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No rides found</p>
          <Link to="/user/book">
            <Button>Book Your First Ride</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RideHistory;
