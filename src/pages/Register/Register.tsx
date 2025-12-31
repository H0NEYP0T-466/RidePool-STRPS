import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'driver' | 'admin',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      navigate('/user/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join RidePool and start saving on rides</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="role-selector">
            <button
              type="button"
              className={`role-option ${formData.role === 'user' ? 'active' : ''}`}
              onClick={() => handleChange('role', 'user')}
            >
              <span>🚗</span>
              Rider
            </button>
            <button
              type="button"
              className={`role-option ${formData.role === 'driver' ? 'active' : ''}`}
              onClick={() => handleChange('role', 'driver')}
            >
              <span>🚕</span>
              Driver
            </button>
          </div>

          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />

          <div className="form-row">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
            <Input
              type="tel"
              label="Phone Number"
              placeholder="+923001234567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <Input
              type="password"
              label="Password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
            />
          </div>

          <Button type="submit" isBlock isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
