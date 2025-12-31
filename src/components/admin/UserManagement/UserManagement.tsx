import { useState, useEffect } from 'react';
import api from '../../../services/api';
import Button from '../../common/Button/Button';
import { formatDate } from '../../../utils/helpers';
import type { User, Pagination } from '../../../types';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async (page: number = 1, role?: string) => {
    setIsLoading(true);
    try {
      const params: { page: number; limit: number; role?: string } = { page, limit: 12 };
      if (role) params.role = role;

      const response = await api.get('/api/admin/users', { params });
      setUsers(response.data.data.users || []);
      setPagination(response.data.data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, roleFilter || undefined);
  }, [roleFilter]);

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, roleFilter || undefined);
  };

  const filters = [
    { value: '', label: 'All' },
    { value: 'user', label: 'Users' },
    { value: 'driver', label: 'Drivers' },
    { value: 'admin', label: 'Admins' },
  ];

  return (
    <div className="user-management">
      <div className="management-header">
        <h1>User Management</h1>
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-tab ${roleFilter === filter.value ? 'active' : ''}`}
              onClick={() => setRoleFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading users...</div>
      ) : users.length > 0 ? (
        <>
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </div>
                </div>

                <div className="user-details">
                  <div className="detail-row">
                    <span>Phone</span>
                    <strong>{user.phone}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Joined</span>
                    <strong>{formatDate(user.createdAt)}</strong>
                  </div>
                </div>

                <div className="user-actions">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="secondary">
                    Edit
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
          <p>No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
