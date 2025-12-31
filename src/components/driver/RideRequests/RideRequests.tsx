import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Button from '../../common/Button/Button';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import type { RideRequest, Pagination } from '../../../types';
import './RideRequests.css';

const RideRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/driver/ride-requests', {
        params: { page, limit: 10 },
      });
      setRequests(response.data.data.requests || []);
      setPagination(response.data.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch ride requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (bookingId: string) => {
    try {
      await api.post(`/api/driver/ride/${bookingId}/accept`);
      setRequests((prev) => prev.filter((r) => r.bookingId !== bookingId));
      navigate('/driver/active');
    } catch (error) {
      console.error('Failed to accept ride:', error);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await api.post(`/api/driver/ride/${bookingId}/reject`);
      setRequests((prev) => prev.filter((r) => r.bookingId !== bookingId));
    } catch (error) {
      console.error('Failed to reject ride:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchRequests(newPage);
  };

  return (
    <div className="ride-requests">
      <div className="requests-header">
        <h1>Ride Requests</h1>
        <p>Accept rides to start earning</p>
      </div>

      {isLoading ? (
        <div className="loading">Loading requests...</div>
      ) : requests.length > 0 ? (
        <>
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request.bookingId} className="request-card">
                <div className="request-header">
                  <div className="user-info">
                    <div className="user-avatar">{request.userName.charAt(0)}</div>
                    <div className="user-details">
                      <h3>{request.userName}</h3>
                      <p>Requested {formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                  <div className="request-fare">
                    <div className="fare">{formatCurrency(request.fare)}</div>
                    <div className="label">Estimated Fare</div>
                  </div>
                </div>

                <div className="request-locations">
                  <div className="location-item">
                    <div className="location-marker pickup" />
                    <div className="location-details">
                      <span>Pickup</span>
                      <p>
                        {request.pickupLocation.address ||
                          `${request.pickupLocation.lat.toFixed(4)}, ${request.pickupLocation.lng.toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                  <div className="location-item">
                    <div className="location-marker dropoff" />
                    <div className="location-details">
                      <span>Dropoff</span>
                      <p>
                        {request.dropoffLocation.address ||
                          `${request.dropoffLocation.lat.toFixed(4)}, ${request.dropoffLocation.lng.toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="request-meta">
                  {request.wantPooling && (
                    <span className="pooling-badge">👥 Pooling Enabled</span>
                  )}
                </div>

                <div className="request-actions">
                  <Button onClick={() => handleAccept(request.bookingId)}>
                    Accept Ride
                  </Button>
                  <Button variant="secondary" onClick={() => handleReject(request.bookingId)}>
                    Decline
                  </Button>
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
          <p>No pending ride requests at the moment</p>
          <p>New requests will appear here automatically</p>
        </div>
      )}
    </div>
  );
};

export default RideRequests;
