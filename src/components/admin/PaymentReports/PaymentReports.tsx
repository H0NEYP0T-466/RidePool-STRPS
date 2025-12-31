import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import type { PaymentSummary, Payment, Pagination } from '../../../types';
import './PaymentReports.css';

const PaymentReports = () => {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/admin/payments', {
        params: { page, limit: 10 },
      });
      setSummary(response.data.data.summary);
      setPayments(response.data.data.payments || []);
      setPagination(response.data.data.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPayments(newPage);
  };

  return (
    <div className="payment-reports">
      <div className="reports-header">
        <h1>Payment Reports</h1>
        <p>Revenue and payment analytics</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>{formatCurrency(summary?.totalRevenue || 0)}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="summary-card">
          <h3>{summary?.totalRides || 0}</h3>
          <p>Total Rides</p>
        </div>
        <div className="summary-card">
          <h3>{summary?.completedRides || 0}</h3>
          <p>Completed Rides</p>
        </div>
        <div className="summary-card">
          <h3>{summary?.pooledRides || 0}</h3>
          <p>Pooled Rides</p>
        </div>
        <div className="summary-card">
          <h3>{formatCurrency(summary?.averageFare || 0)}</h3>
          <p>Average Fare</p>
        </div>
      </div>

      <div className="payments-table">
        <div className="table-header">
          <h2>Recent Payments</h2>
        </div>

        {isLoading ? (
          <div className="loading">Loading payments...</div>
        ) : payments.length > 0 ? (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Ride ID</th>
                    <th>Driver</th>
                    <th>Passengers</th>
                    <th>Pooled</th>
                    <th>Amount</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.rideId}>
                      <td className="ride-id">#{payment.rideId.slice(-8)}</td>
                      <td>{payment.driverName || 'Unknown'}</td>
                      <td>{payment.passengerCount}</td>
                      <td>
                        {payment.isPooled ? (
                          <span className="pooled-badge">👥 Yes</span>
                        ) : (
                          <span style={{ color: '#a0a0a0' }}>No</span>
                        )}
                      </td>
                      <td className="amount">{formatCurrency(payment.totalFare)}</td>
                      <td>{payment.completedAt ? formatDate(payment.completedAt) : '-'}</td>
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
            <p>No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReports;
