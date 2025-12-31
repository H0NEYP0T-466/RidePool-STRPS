import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../../utils/helpers';
import type { Ride, Pagination } from '../../../types';
import './TripMonitoring.css';

const TripMonitoring = () => {
  const [trips, setTrips] = useState<Ride[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrips = async (page: number = 1, status?: string) => {
    setIsLoading(true);
    try {
      const params: { page: number; limit: number; status?: string } = { page, limit: 10 };
      if (status) params.status = status;

      const response = await api.get('/api/admin/trips', { params });
      setTrips(response.data.data.trips || []);
      setPagination(response.data.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(1, statusFilter || undefined);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchTrips(newPage, statusFilter || undefined);
  };

  const filters = [
    { value: '', label: 'All' },
    { value: 'requested', label: 'Requested' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="trip-monitoring">
      <div className="monitoring-header">
        <h1>Trip Monitoring</h1>
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

      <div className="trips-table">
        {isLoading ? (
          <div className="loading">Loading trips...</div>
        ) : trips.length > 0 ? (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Driver</th>
                    <th>Passengers</th>
                    <th>Status</th>
                    <th>Pooled</th>
                    <th>Fare</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td className="trip-id">#{trip.id.slice(-8)}</td>
                      <td>{trip.driverName || 'Not Assigned'}</td>
                      <td>{trip.passengers.length}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(trip.status)}20`,
                            color: getStatusColor(trip.status),
                          }}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td>
                        {trip.isPooled ? (
                          <span className="pooled-badge">👥 Yes</span>
                        ) : (
                          <span style={{ color: '#a0a0a0' }}>No</span>
                        )}
                      </td>
                      <td>{formatCurrency(trip.totalFare)}</td>
                      <td>{formatDate(trip.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <p>No trips found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripMonitoring;
