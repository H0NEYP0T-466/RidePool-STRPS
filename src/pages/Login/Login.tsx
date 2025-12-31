import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { getUser } from '../../utils/helpers';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isBackendAvailable } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      
      // Navigate based on user role
      const user = getUser();
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }, message?: string };
      setError(error.response?.data?.detail || error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (type: 'user' | 'driver' | 'admin') => {
    const credentials = {
      user: { email: 'user1@ridepool.pk', password: 'password123' },
      driver: { email: 'driver1@ridepool.pk', password: 'password123' },
      admin: { email: 'admin1@ridepool.pk', password: 'password123' },
    };
    setEmail(credentials[type].email);
    setPassword(credentials[type].password);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to RidePool</p>
        </div>

        {!isBackendAvailable && (
          <div className="demo-mode-notice">
            <span className="demo-icon">🔧</span>
            <span>Demo Mode Active - Use test credentials below</span>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" isBlock isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>

        <div className="test-credentials">
          <p className="credentials-title">🔑 Test Credentials (click to fill):</p>
          <div className="credentials-buttons">
            <button type="button" className="credential-btn user" onClick={() => fillCredentials('user')}>
              <span className="credential-icon">👤</span>
              <span className="credential-label">User</span>
              <span className="credential-email">user1@ridepool.pk</span>
            </button>
            <button type="button" className="credential-btn driver" onClick={() => fillCredentials('driver')}>
              <span className="credential-icon">🚗</span>
              <span className="credential-label">Driver</span>
              <span className="credential-email">driver1@ridepool.pk</span>
            </button>
            <button type="button" className="credential-btn admin" onClick={() => fillCredentials('admin')}>
              <span className="credential-icon">⚙️</span>
              <span className="credential-label">Admin</span>
              <span className="credential-email">admin1@ridepool.pk</span>
            </button>
          </div>
          <p className="password-hint">Password for all: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
