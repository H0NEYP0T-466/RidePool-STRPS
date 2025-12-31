import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1>
          Smart <span>Ride-Pooling</span> for Pakistan
        </h1>
        <p>
          Save money, reduce traffic, and travel smarter with RidePool STRPS. 
          Connect with others going your way and share the ride.
        </p>
        <div className="hero-buttons">
          <Link to="/register">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose RidePool?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Save Money</h3>
            <p>Share rides and split costs. Pool with others to save up to 30% on every trip.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Easy Booking</h3>
            <p>Book a ride in seconds. Set pickup and dropoff, and we'll find you a match.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Real-time Tracking</h3>
            <p>Track your ride live on the map. Know exactly where your driver is.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Safe & Secure</h3>
            <p>Verified drivers, rated trips, and 24/7 support for your peace of mind.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Eco-Friendly</h3>
            <p>Reduce your carbon footprint by sharing rides and reducing vehicles on road.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Matching</h3>
            <p>Our smart algorithm finds pool partners going your way in seconds.</p>
          </div>
        </div>
      </section>

      <section className="cities-section">
        <h2>Available Cities</h2>
        <div className="cities-grid">
          <div className="city-card">
            <h4>Islamabad</h4>
            <p>Capital Territory</p>
          </div>
          <div className="city-card">
            <h4>Lahore</h4>
            <p>Punjab</p>
          </div>
          <div className="city-card">
            <h4>Karachi</h4>
            <p>Sindh</p>
          </div>
          <div className="city-card">
            <h4>Rawalpindi</h4>
            <p>Punjab</p>
          </div>
          <div className="city-card">
            <h4>Faisalabad</h4>
            <p>Punjab</p>
          </div>
          <div className="city-card">
            <h4>Multan</h4>
            <p>Punjab</p>
          </div>
          <div className="city-card">
            <h4>Peshawar</h4>
            <p>KPK</p>
          </div>
          <div className="city-card">
            <h4>Hyderabad</h4>
            <p>Sindh</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Verified Drivers</p>
          </div>
          <div className="stat-item">
            <h3>50K+</h3>
            <p>Rides Completed</p>
          </div>
          <div className="stat-item">
            <h3>8</h3>
            <p>Cities Covered</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
