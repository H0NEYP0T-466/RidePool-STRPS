import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>RidePool STRPS</h3>
          <p>Smart Transportation & Ride-Pooling System</p>
          <p>Making commuting easier and affordable across Pakistan.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Cities</h3>
          <ul>
            <li>Islamabad</li>
            <li>Lahore</li>
            <li>Karachi</li>
            <li>Rawalpindi</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@ridepool.pk</p>
          <p>Phone: +92 300 1234567</p>
          <p>Address: Blue Area, Islamabad</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} RidePool STRPS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
