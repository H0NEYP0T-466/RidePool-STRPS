import { useAuth } from '../../../context/AuthContext';
import './BackendStatusBanner.css';

const BackendStatusBanner = () => {
  const { isBackendAvailable, isLoading } = useAuth();

  // Don't show if backend is available or still loading
  if (isBackendAvailable || isLoading) {
    return null;
  }

  return (
    <div className="backend-status-banner">
      <div className="banner-content">
        <span className="banner-icon">⚠️</span>
        <span className="banner-text">
          Backend unavailable - Working on demo data
        </span>
        <div className="banner-indicator">
          <span className="indicator-dot"></span>
          <span className="indicator-label">Demo Mode</span>
        </div>
      </div>
    </div>
  );
};

export default BackendStatusBanner;
