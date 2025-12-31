import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { formatDate } from '../../../utils/helpers';
import type { Feedback, Pagination } from '../../../types';
import './FeedbackDashboard.css';

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/admin/feedback', {
        params: { page, limit: 10 },
      });
      const data = response.data.data;
      setFeedbacks(data.feedback || []);
      setAverageRating(data.averageRating || 0);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });

      // Calculate rating distribution
      const distribution = [0, 0, 0, 0, 0];
      (data.feedback || []).forEach((f: Feedback) => {
        if (f.rating >= 1 && f.rating <= 5) {
          distribution[f.rating - 1]++;
        }
      });
      setRatingDistribution(distribution);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchFeedback(newPage);
  };

  const getStars = (rating: number): string => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const totalFeedbacks = ratingDistribution.reduce((a, b) => a + b, 0);

  return (
    <div className="feedback-dashboard">
      <div className="feedback-header">
        <h1>Feedback Dashboard</h1>
        <p>User ratings and reviews</p>
      </div>

      <div className="rating-summary">
        <div className="average-rating">
          <div className="rating-value">{averageRating.toFixed(1)}</div>
          <div className="rating-stars">{getStars(Math.round(averageRating))}</div>
          <div className="rating-count">{pagination.total} reviews</div>
        </div>

        <div className="rating-breakdown">
          <h3>Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating - 1];
            const percentage = totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0;
            return (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating} stars</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${percentage}%` }} />
                </div>
                <span className="rating-count-small">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading feedback...</div>
      ) : feedbacks.length > 0 ? (
        <>
          <div className="feedback-list">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-card">
                <div className="feedback-header-row">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {feedback.userName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="reviewer-details">
                      <h4>{feedback.userName || 'Anonymous'}</h4>
                      <p>Reviewed {feedback.driverName || 'Driver'}</p>
                    </div>
                  </div>
                  <div className="feedback-rating">
                    <span>{getStars(feedback.rating)}</span>
                    <strong>{feedback.rating}/5</strong>
                  </div>
                </div>

                {feedback.comment && (
                  <div className="feedback-content">
                    <p>"{feedback.comment}"</p>
                  </div>
                )}

                <div className="feedback-meta">
                  <span>Ride #{feedback.rideId.slice(-6)}</span>
                  <span>{formatDate(feedback.createdAt)}</span>
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
          <p>No feedback yet</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackDashboard;
