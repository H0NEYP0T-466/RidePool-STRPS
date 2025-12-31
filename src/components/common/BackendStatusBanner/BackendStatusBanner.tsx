import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './BackendStatusBanner.css';

const BackendStatusBanner = () => {
  const { isBackendAvailable, isLoading } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if backend is available, still loading, or dismissed
  if (isBackendAvailable || isLoading || isDismissed) {
    return null;
  }

  const handleClose = () => {
    setIsDismissed(true);
  };

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
        <button 
          className="banner-close-btn" 
          onClick={handleClose}
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default BackendStatusBanner;
