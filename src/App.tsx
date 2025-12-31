import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RideProvider } from './context/RideContext';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

// User Components
import UserDashboard from './components/user/UserDashboard/UserDashboard';
import RideBooking from './components/user/RideBooking/RideBooking';
import RideHistory from './components/user/RideHistory/RideHistory';
import RideTracking from './components/user/RideTracking/RideTracking';

// Driver Components
import DriverDashboard from './components/driver/DriverDashboard/DriverDashboard';
import RideRequests from './components/driver/RideRequests/RideRequests';
import ActiveRide from './components/driver/ActiveRide/ActiveRide';
import RouteOptimization from './components/driver/RouteOptimization/RouteOptimization';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard/AdminDashboard';
import TripMonitoring from './components/admin/TripMonitoring/TripMonitoring';
import PaymentReports from './components/admin/PaymentReports/PaymentReports';
import UserManagement from './components/admin/UserManagement/UserManagement';
import FeedbackDashboard from './components/admin/FeedbackDashboard/FeedbackDashboard';

import './App.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'driver') {
      return <Navigate to="/driver/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'driver') {
      return <Navigate to="/driver/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/book"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <RideBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/history"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <RideHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/track"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <RideTracking />
          </ProtectedRoute>
        }
      />

      {/* Driver Routes */}
      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute allowedRoles={['driver', 'admin']}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/requests"
        element={
          <ProtectedRoute allowedRoles={['driver', 'admin']}>
            <RideRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/active"
        element={
          <ProtectedRoute allowedRoles={['driver', 'admin']}>
            <ActiveRide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/history"
        element={
          <ProtectedRoute allowedRoles={['driver', 'admin']}>
            <RideHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/route"
        element={
          <ProtectedRoute allowedRoles={['driver', 'admin']}>
            <RouteOptimization />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/trips"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <TripMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/drivers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PaymentReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <FeedbackDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RideProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </RideProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
