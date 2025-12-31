import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard' },
          { path: '/admin/trips', label: 'Trips' },
          { path: '/admin/users', label: 'Users' },
          { path: '/admin/drivers', label: 'Drivers' },
          { path: '/admin/payments', label: 'Payments' },
          { path: '/admin/feedback', label: 'Feedback' },
        ];
      case 'driver':
        return [
          { path: '/driver/dashboard', label: 'Dashboard' },
          { path: '/driver/requests', label: 'Ride Requests' },
          { path: '/driver/active', label: 'Active Ride' },
          { path: '/driver/history', label: 'History' },
        ];
      default:
        return [
          { path: '/user/dashboard', label: 'Dashboard' },
          { path: '/user/book', label: 'Book Ride' },
          { path: '/user/history', label: 'History' },
          { path: '/user/track', label: 'Track Ride' },
        ];
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <h1>RidePool</h1>
        <span>STRPS</span>
      </Link>

      {isAuthenticated ? (
        <>
          <ul className="navbar-nav">
            {getNavLinks().map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="navbar-auth">
          <Link to="/login" className="login-link">
            Login
          </Link>
          <Link to="/register" className="register-link">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
