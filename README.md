# RidePool-STRPS

> **Smart Transportation & Ride-Pooling System (STRPS)** — A comprehensive platform enabling efficient ride-sharing through real-time matching, live GPS tracking, and multi-role management.

<p align="center">

  <!-- Core -->
  ![GitHub License](https://img.shields.io/github/license/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=brightgreen)  
  ![GitHub Stars](https://img.shields.io/github/stars/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=yellow)  
  ![GitHub Forks](https://img.shields.io/github/forks/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=blue)  
  ![GitHub Issues](https://img.shields.io/github/issues/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=red)  
  ![GitHub Pull Requests](https://img.shields.io/github/issues-pr/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=orange)  
  ![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge)  

  <!-- Activity -->
  ![Last Commit](https://img.shields.io/github/last-commit/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=purple)  
  ![Commit Activity](https://img.shields.io/github/commit-activity/m/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=teal)  
  ![Repo Size](https://img.shields.io/github/repo-size/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=blueviolet)  
  ![Code Size](https://img.shields.io/github/languages/code-size/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=indigo)  

  <!-- Languages -->
  ![Top Language](https://img.shields.io/github/languages/top/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=critical)  
  ![Languages Count](https://img.shields.io/github/languages/count/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=success)  

  <!-- Optional CI/Security -->


  <!-- Community -->
  ![Discussions](https://img.shields.io/github/discussions/H0NEYP0T-466/RidePool-STRPS?style=for-the-badge&color=blue)  
  ![Documentation](https://img.shields.io/badge/Docs-Available-green?style=for-the-badge&logo=readthedocs&logoColor=white)  
  ![Open Source Love](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)  

</p>

---

## 📄 Abstract

**RidePool-STRPS** is a full-stack ride-pooling platform designed to optimize transportation through intelligent ride matching, real-time GPS tracking, and comprehensive multi-role management. The system caters to three primary user types: **Riders** (users requesting rides), **Drivers** (service providers), and **Admins** (platform managers).

Built with modern web technologies including **React**, **TypeScript**, **FastAPI**, and **MongoDB**, RidePool-STRPS leverages **WebSocket** connections for real-time updates and **Leaflet** maps for live location tracking. The platform implements secure **JWT-based authentication**, intelligent ride-matching algorithms, and dynamic fare calculation to provide an efficient, scalable solution for urban transportation needs.

### Key Capabilities
- 🚗 **Intelligent Ride Matching** — Automatically matches riders with nearby drivers based on location, route compatibility, and pooling preferences
- 📍 **Live GPS Tracking** — Real-time driver location updates and route visualization using Leaflet maps
- 👥 **Multi-Role Architecture** — Separate interfaces for riders, drivers, and administrators with role-based access control
- 🔐 **Secure Authentication** — JWT-based auth system with protected routes and token management
- ⚡ **Real-Time Updates** — WebSocket-powered instant notifications for ride status changes, driver locations, and booking confirmations
- 📊 **Admin Dashboard** — Comprehensive analytics, user management, and operational oversight tools
- 💰 **Dynamic Pricing** — Distance-based fare calculation with pooling discounts and surge pricing support
- 🚦 **Trip Management** — Complete ride lifecycle management from booking to completion with status tracking

## 🔗 Quick Links

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-success?style=for-the-badge&logo=vercel&logoColor=white)](https://ride-pool-strps.vercel.app)
[![Documentation](https://img.shields.io/badge/Documentation-Read%20Now-blue?style=for-the-badge&logo=readthedocs&logoColor=white)](./docs)

- 🌐 **Live Demo**: [https://ride-pool-strps.vercel.app](https://ride-pool-strps.vercel.app)
- 📚 **Documentation**: [`/docs`](./docs)
- 🐛 **Issues**: [github.com/H0NEYP0T-466/RidePool-STRPS/issues](https://github.com/H0NEYP0T-466/RidePool-STRPS/issues)
- 🤝 **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- 🔒 **Security**: [SECURITY.md](./SECURITY.md)

## 📑 Table of Contents
- [📄 Abstract](#-abstract)
- [🔗 Quick Links](#-quick-links)
- [✨ Key Highlights](#-key-highlights)
- [🏗 Architecture](#-architecture)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Configuration](#-environment-configuration)
- [⚡ Usage](#-usage)
- [📡 API Documentation](#-api-documentation)
- [✨ Features](#-features)
- [📂 Folder Structure](#-folder-structure)
- [🚀 Deployment](#-deployment)
- [🔧 Development Workflow](#-development-workflow)
- [📸 Screenshots](#-screenshots)
- [🛠 Troubleshooting](#-troubleshooting)
- [🛠 Tech Stack](#-tech-stack)
- [📦 Dependencies & Packages](#-dependencies--packages)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🛡 Security](#-security)
- [📏 Code of Conduct](#-code-of-conduct)

## ✨ Key Highlights

- 🚗 **Real-Time Ride Matching & Pooling** — Advanced algorithms match riders with compatible routes for efficient carpooling
- 📍 **Live GPS Tracking** — Real-time driver location updates with interactive Leaflet map visualization
- 👥 **Three User Roles** — Dedicated interfaces for Riders, Drivers, and Admins with role-based permissions
- 🔐 **JWT Authentication & Security** — Secure token-based authentication with protected API routes
- ⚡ **WebSocket Real-Time Updates** — Instant notifications for ride status changes, driver locations, and bookings
- 📊 **Admin Analytics Dashboard** — Comprehensive platform metrics, user management, and revenue tracking
- 💰 **Dynamic Fare Calculation** — Distance-based pricing with pooling discounts and surge pricing
- 🗺️ **Route Optimization** — Intelligent routing for pooled rides with minimal detours
- 📱 **Responsive Design** — Mobile-first UI that works seamlessly across all devices
- 🔄 **Automatic Ride Matching** — Background service continuously matches available drivers with ride requests

---

## 🏗 Architecture

### System Overview

RidePool-STRPS follows a modern **client-server architecture** with real-time communication capabilities:

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Rider App   │  │  Driver App  │  │  Admin Panel │          │
│  │  (React)     │  │  (React)     │  │  (React)     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                 ┌───────────┴───────────┐
                 │   HTTP/WebSocket      │
                 └───────────┬───────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                       SERVER LAYER                               │
│                            │                                     │
│         ┌──────────────────┴──────────────────┐                 │
│         │      FastAPI + Socket.IO            │                 │
│         │  ┌─────────────────────────────┐    │                 │
│         │  │   Authentication Middleware │    │                 │
│         │  └─────────────────────────────┘    │                 │
│         │  ┌──────┐ ┌──────┐ ┌──────┐        │                 │
│         │  │ Auth │ │ Ride │ │Admin │        │                 │
│         │  │ APIs │ │ APIs │ │ APIs │        │                 │
│         │  └──┬───┘ └──┬───┘ └──┬───┘        │                 │
│         │     │        │        │             │                 │
│         │     └────────┼────────┘             │                 │
│         │              │                      │                 │
│         │     ┌────────┴────────┐             │                 │
│         │     │  Business Logic │             │                 │
│         │     │   - Matching    │             │                 │
│         │     │   - Pricing     │             │                 │
│         │     │   - Routing     │             │                 │
│         │     └────────┬────────┘             │                 │
│         └──────────────┼──────────────────────┘                 │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                 ┌───────┴───────┐
                 │   MongoDB     │
                 │   Database    │
                 └───────────────┘
```

### Frontend-Backend Communication

1. **HTTP REST APIs** — CRUD operations for users, rides, bookings, and admin functions
2. **WebSocket (Socket.IO)** — Real-time bidirectional communication for:
   - Driver location updates
   - Ride status notifications
   - Live ride matching alerts
   - Chat/messaging features

### Authentication Flow

```
User Login Request
      │
      ├─> POST /api/auth/login
      │
      ├─> Validate credentials (bcrypt)
      │
      ├─> Generate JWT token (python-jose)
      │
      ├─> Return token + user data
      │
      └─> Client stores token (localStorage)

Protected Request
      │
      ├─> Include token in Authorization header
      │
      ├─> Middleware validates token
      │
      ├─> Decode user from token
      │
      ├─> Check role permissions
      │
      └─> Execute request or return 401/403
```

### Database Schema

**Collections:**
- `users` — User accounts (riders, drivers, admins)
- `drivers` — Driver-specific profiles (vehicle info, availability, ratings)
- `bookings` — Ride requests from riders
- `rides` — Accepted/active ride sessions (can have multiple passengers for pooling)
- `feedback` — Ratings and reviews

**Key Relationships:**
- User ↔ Bookings (1:N)
- Driver ↔ Rides (1:N)
- Ride ↔ Bookings (1:N for pooled rides)

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** 18+ ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **Python** 3.10+ ([Download](https://www.python.org/))
- ✅ **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- ✅ **Git** for version control

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/H0NEYP0T-466/RidePool-STRPS.git
cd RidePool-STRPS
```

#### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file for frontend
cp .env.example .env  # Or create manually

# Start development server
npm run dev
```

The frontend will run at `http://localhost:5173`

#### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file for backend
# Add your MongoDB URI and JWT secret (see Environment Configuration section)

# Start the FastAPI server
uvicorn app.main:socket_app --host 0.0.0.0 --port 8888 --reload
```

The backend API will run at `http://localhost:8888`

#### 4. Database Setup

```bash
# (Optional) Seed sample data
cd backend
python seed_data/seed.py
```

#### 5. Verification

✅ **Frontend:** Open `http://localhost:5173` — You should see the landing page  
✅ **Backend:** Visit `http://localhost:8888/docs` — FastAPI interactive documentation  
✅ **Database:** Check MongoDB connection — Verify collections are created

### Common Gotchas

⚠️ **Port Conflicts:** If ports 5173 or 8888 are in use, modify `vite.config.ts` or use `--port` flag  
⚠️ **MongoDB Connection:** Ensure MongoDB is running locally or your Atlas cluster is accessible  
⚠️ **CORS Errors:** Verify `CORS_ORIGINS` in backend `.env` includes your frontend URL  
⚠️ **WebSocket Issues:** Check that both HTTP and WS URLs are correctly configured in frontend `.env`

---

## ⚙️ Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the project root:

```bash
# API Configuration
VITE_API_URL=http://localhost:8888
VITE_WS_URL=ws://localhost:8888

# Optional: Map Configuration
VITE_MAP_CENTER_LAT=28.6139
VITE_MAP_CENTER_LNG=77.2090
VITE_MAP_ZOOM=12
```

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ridepool
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ridepool?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,https://ride-pool-strps.vercel.app

# Server Configuration
HOST=0.0.0.0
PORT=8888

# Optional: Redis (for production caching)
# REDIS_URL=redis://localhost:6379
```

**Security Note:** Never commit `.env` files to version control. Use `.env.example` as a template.

---

## ⚡ Usage

### For Riders (Users)

1. **Register/Login** — Create an account or log in with existing credentials
2. **Request a Ride**
   - Enter pickup and dropoff locations on the map
   - Choose whether to enable ride pooling (for discounted fares)
   - View estimated fare
   - Confirm booking
3. **Track Your Ride**
   - View real-time driver location on the map
   - See estimated arrival time
   - Receive notifications when driver is nearby
4. **Complete Ride**
   - Pay fare (cash or integrated payment)
   - Rate your driver
   - View ride history

### For Drivers

1. **Register as Driver** — Create account with `driver` role
2. **Set Up Profile**
   - Add vehicle information (type, number, license)
   - Upload required documents
   - Toggle availability status
3. **Accept Rides**
   - View available ride requests nearby
   - Accept rides that match your route
   - View passenger details and destinations
4. **Complete Trip**
   - Update ride status (accepted → in-progress → completed)
   - Share real-time location via WebSocket
   - Collect payment
   - View earnings and trip history

### For Admins

1. **Login with Admin Credentials**
2. **Dashboard Overview**
   - View total users, drivers, and rides
   - Monitor active rides in real-time
   - Track revenue and platform metrics
3. **User Management**
   - View all users and drivers
   - Approve/suspend accounts
   - Handle support requests
4. **Analytics**
   - Generate reports on rides, revenue, and user activity
   - Identify peak hours and popular routes
   - Monitor driver ratings and performance

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |

**Example: Register User**
```bash
curl -X POST http://localhost:8888/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "securepassword",
    "role": "user"
  }'
```

### User/Rider Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/user/profile` | Get user profile | ✅ |
| `PUT` | `/api/user/profile` | Update user profile | ✅ |
| `POST` | `/api/user/ride/request` | Create new ride request | ✅ |
| `GET` | `/api/user/bookings` | Get user's booking history | ✅ |
| `PUT` | `/api/user/bookings/:id/cancel` | Cancel a booking | ✅ |

**Example: Request Ride**
```bash
curl -X POST http://localhost:8888/api/user/ride/request \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": {"lat": 28.6139, "lng": 77.2090, "address": "Connaught Place"},
    "dropoffLocation": {"lat": 28.5355, "lng": 77.3910, "address": "Noida Sector 62"},
    "wantPooling": true
  }'
```

### Driver Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/driver/profile` | Get driver profile | ✅ (Driver) |
| `PUT` | `/api/driver/profile` | Update driver profile | ✅ (Driver) |
| `PUT` | `/api/driver/location` | Update current location | ✅ (Driver) |
| `PUT` | `/api/driver/availability` | Toggle availability | ✅ (Driver) |
| `GET` | `/api/driver/rides` | Get driver's ride history | ✅ (Driver) |
| `PUT` | `/api/driver/rides/:id/accept` | Accept a ride request | ✅ (Driver) |
| `PUT` | `/api/driver/rides/:id/complete` | Mark ride as completed | ✅ (Driver) |

### Ride Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/rides/available-pools` | Get available pooling rides | ✅ |
| `GET` | `/api/rides/:id` | Get ride details | ✅ |
| `PUT` | `/api/rides/:id/status` | Update ride status | ✅ |
| `POST` | `/api/rides/:id/join` | Join a pooled ride | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/admin/dashboard` | Get dashboard statistics | ✅ (Admin) |
| `GET` | `/api/admin/users` | Get all users | ✅ (Admin) |
| `GET` | `/api/admin/drivers` | Get all drivers | ✅ (Admin) |
| `GET` | `/api/admin/rides` | Get all rides | ✅ (Admin) |
| `PUT` | `/api/admin/users/:id` | Update user status | ✅ (Admin) |
| `DELETE` | `/api/admin/users/:id` | Delete user | ✅ (Admin) |

**Example: Get Admin Dashboard**
```bash
curl -X GET http://localhost:8888/api/admin/dashboard \
  -H "Authorization: Bearer <admin-token>"
```

### WebSocket Events

**Client → Server Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `connect` | `{ userId, role }` | Establish WebSocket connection |
| `driver:location` | `{ driverId, lat, lng }` | Driver location update |
| `driver:availability` | `{ driverId, isAvailable }` | Driver availability toggle |

**Server → Client Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `ride:matched` | `{ rideId, driverId, pickupETA }` | Ride matched with driver |
| `ride:status` | `{ rideId, status, message }` | Ride status update |
| `driver:location:update` | `{ driverId, lat, lng, timestamp }` | Real-time driver location |
| `booking:confirmed` | `{ bookingId, rideId, fare }` | Booking confirmation |

**Example: WebSocket Client (JavaScript)**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:8888', {
  auth: { token: 'your-jwt-token' }
});

// Listen for ride status updates
socket.on('ride:status', (data) => {
  console.log('Ride status:', data.status);
});

// Send driver location update
socket.emit('driver:location', {
  driverId: 'driver123',
  lat: 28.6139,
  lng: 77.2090
});
```

### API Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* optional error details */ }
}
```

### Rate Limiting

- **Default:** 100 requests per minute per IP
- **Authenticated:** 500 requests per minute per user
- **Admin:** Unlimited

For complete API documentation with interactive examples, visit: **`http://localhost:8888/docs`** (FastAPI Swagger UI)

---

## ✨ Features

### 🚗 For Riders
- **Easy Booking** — Simple interface to request rides with pickup/dropoff selection
- **Ride Pooling** — Share rides with others heading in the same direction for reduced fares
- **Live Tracking** — Real-time driver location on interactive maps
- **Fare Estimates** — Transparent pricing before booking
- **Ride History** — Complete record of all past trips
- **Driver Ratings** — Rate drivers after each trip
- **Instant Notifications** — Real-time alerts for ride status updates

### 🚙 For Drivers
- **Flexible Availability** — Toggle online/offline status anytime
- **Smart Ride Matching** — Receive ride requests based on your location and route
- **Route Optimization** — Efficient routing for pooled rides with minimal detours
- **Earnings Tracking** — Monitor your income and trip statistics
- **Rating System** — Build reputation through customer feedback
- **Profile Management** — Update vehicle details and documentation
- **Real-Time Communication** — Instant updates on ride status and passenger information

### 👨‍💼 For Admins
- **Comprehensive Dashboard** — Real-time metrics on platform activity
- **User Management** — View, edit, and manage rider and driver accounts
- **Ride Monitoring** — Track all active and completed rides
- **Revenue Analytics** — Detailed financial reports and insights
- **Driver Verification** — Approve/reject driver registrations
- **Support Tools** — Handle disputes and customer support requests
- **Platform Analytics** — Insights into peak hours, popular routes, and user behavior

### 🔧 Technical Features
- **JWT Authentication** — Secure token-based user authentication
- **Role-Based Access Control** — Different permissions for riders, drivers, and admins
- **WebSocket Integration** — Real-time bidirectional communication
- **Responsive Design** — Mobile-first approach that works on all devices
- **RESTful API** — Clean, well-documented API endpoints
- **MongoDB Database** — Scalable NoSQL database for flexible data modeling
- **Leaflet Maps** — Interactive map visualization with markers and routing
- **Type-Safe Frontend** — TypeScript for enhanced code quality and developer experience

---

## 📂 Folder Structure

Comprehensive overview of the project structure:

```
RidePool-STRPS/
├── backend/                          # Backend API (FastAPI + Socket.IO)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI entry point with Socket.IO integration
│   │   ├── config.py                 # Configuration management
│   │   │
│   │   ├── models/                   # Pydantic models & DB schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py               # User model (UserCreate, UserLogin, UserUpdate)
│   │   │   ├── driver.py             # Driver model (DriverCreate, DriverUpdate)
│   │   │   ├── booking.py            # Booking model (BookingCreate)
│   │   │   ├── ride.py               # Ride model (RideCreate, RideUpdate)
│   │   │   └── feedback.py           # Feedback model (FeedbackCreate)
│   │   │
│   │   ├── routes/                   # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py               # Authentication routes (/api/auth/*)
│   │   │   ├── user.py               # User/Rider routes (/api/user/*)
│   │   │   ├── driver.py             # Driver routes (/api/driver/*)
│   │   │   ├── ride.py               # Ride management routes (/api/rides/*)
│   │   │   └── admin.py              # Admin routes (/api/admin/*)
│   │   │
│   │   ├── services/                 # Business logic
│   │   │   ├── auth_service.py       # User registration, login, profile updates
│   │   │   ├── ride_matching.py      # Ride matching algorithms
│   │   │   └── payment_service.py    # Fare calculation and payment logic
│   │   │
│   │   ├── utils/                    # Helper functions
│   │   │   ├── database.py           # MongoDB connection and helpers
│   │   │   └── jwt_handler.py        # JWT token generation and validation
│   │   │
│   │   └── websocket/                # WebSocket handlers
│   │       ├── __init__.py
│   │       └── socket_handler.py     # Socket.IO event handlers
│   │
│   ├── seed_data/                    # Sample data loaders
│   │   └── seed.py                   # MongoDB seeding script
│   │
│   ├── .env                          # Environment variables (not committed)
│   ├── requirements.txt              # Python dependencies
│   └── run_commands.txt              # Quick reference commands
│
├── src/                              # Frontend React application
│   ├── assets/                       # Images, icons, styles
│   │   ├── images/                   # Image assets
│   │   └── styles/                   # Global CSS/SCSS files
│   │
│   ├── components/                   # React components
│   │   ├── common/                   # Shared/reusable components
│   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   ├── Footer.tsx            # Footer component
│   │   │   ├── Map.tsx               # Leaflet map wrapper
│   │   │   └── LoadingSpinner.tsx    # Loading indicator
│   │   │
│   │   ├── user/                     # Rider-specific components
│   │   │   ├── BookingForm.tsx       # Ride booking form
│   │   │   ├── RideTracker.tsx       # Live ride tracking
│   │   │   └── RideHistory.tsx       # Past rides list
│   │   │
│   │   ├── driver/                   # Driver-specific components
│   │   │   ├── DriverDashboard.tsx   # Driver main dashboard
│   │   │   ├── RideRequests.tsx      # Available ride requests
│   │   │   └── ActiveRides.tsx       # Ongoing rides
│   │   │
│   │   └── admin/                    # Admin dashboard components
│   │       ├── AdminDashboard.tsx    # Admin overview
│   │       ├── UserManagement.tsx    # User management panel
│   │       ├── DriverManagement.tsx  # Driver management panel
│   │       └── Analytics.tsx         # Platform analytics
│   │
│   ├── context/                      # React Context providers
│   │   ├── AuthContext.tsx           # Authentication state management
│   │   └── RideContext.tsx           # Ride/booking state management
│   │
│   ├── pages/                        # Route-level pages
│   │   ├── Landing/
│   │   │   └── LandingPage.tsx       # Landing page
│   │   ├── Login/
│   │   │   └── Login.tsx             # Login page
│   │   ├── Register/
│   │   │   └── Register.tsx          # Registration page
│   │   ├── user/                     # Rider pages (not shown in detail)
│   │   ├── driver/                   # Driver pages (not shown in detail)
│   │   └── admin/                    # Admin pages (not shown in detail)
│   │
│   ├── services/                     # API clients
│   │   ├── api.ts                    # Axios instance configuration
│   │   └── socket.ts                 # Socket.IO client setup
│   │
│   ├── types/                        # TypeScript definitions
│   │   ├── user.ts                   # User-related types
│   │   ├── ride.ts                   # Ride-related types
│   │   └── booking.ts                # Booking-related types
│   │
│   ├── utils/                        # Utility functions
│   │   ├── formatters.ts             # Data formatting helpers
│   │   └── validators.ts             # Form validation utilities
│   │
│   ├── data/                         # Static data/constants
│   ├── App.tsx                       # Main App component with routing
│   ├── App.css                       # App-level styles
│   ├── main.tsx                      # React entry point
│   └── index.css                     # Global styles
│
├── public/                           # Static assets served by Vite
│   ├── favicon.ico
│   └── vite.svg
│
├── docs/                             # Documentation
│   ├── API.md                        # API documentation
│   ├── SETUP.md                      # Setup instructions
│   └── DEPLOYMENT.md                 # Deployment guide
│
├── .github/                          # GitHub workflows and templates
│   ├── workflows/                    # GitHub Actions
│   └── ISSUE_TEMPLATE/               # Issue templates
│
├── .env                              # Frontend environment variables (not committed)
├── .env.example                      # Example environment file
├── .gitignore                        # Git ignore rules
├── package.json                      # Node.js dependencies
├── package-lock.json                 # Locked dependency versions
├── vite.config.ts                    # Vite configuration
├── tsconfig.json                     # TypeScript configuration (base)
├── tsconfig.app.json                 # TypeScript config for app
├── tsconfig.node.json                # TypeScript config for Node.js
├── eslint.config.js                  # ESLint configuration
├── index.html                        # HTML entry point
│
├── README.md                         # This file
├── CONTRIBUTING.md                   # Contribution guidelines
├── CODE_OF_CONDUCT.md                # Community standards
├── SECURITY.md                       # Security policies
└── LICENSE                           # MIT License
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub** — Ensure your code is pushed to GitHub
2. **Connect to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```
3. **Configure Environment Variables** in Vercel dashboard:
   - `VITE_API_URL` — Your production backend URL
   - `VITE_WS_URL` — Your production WebSocket URL
4. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**Live Demo:** [https://ride-pool-strps.vercel.app](https://ride-pool-strps.vercel.app)

### Backend Deployment (Railway/Render)

#### Option 1: Railway

1. **Create New Project** on [Railway](https://railway.app/)
2. **Connect GitHub Repository**
3. **Add Environment Variables:**
   ```bash
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-production-secret
   CORS_ORIGINS=https://ride-pool-strps.vercel.app
   ```
4. **Configure Start Command:**
   ```bash
   cd backend && pip install -r requirements.txt && uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT
   ```
5. **Deploy** — Railway will auto-deploy on push

#### Option 2: Render

1. **Create Web Service** on [Render](https://render.com/)
2. **Settings:**
   - Environment: `Python 3`
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`
3. **Add Environment Variables** (same as Railway)
4. **Deploy**

### Database Deployment (MongoDB Atlas)

1. **Create Cluster** on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Whitelist IPs** or allow access from anywhere (`0.0.0.0/0`)
3. **Create Database User**
4. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ridepool?retryWrites=true&w=majority
   ```
5. **Update** `MONGODB_URI` in backend environment variables
6. **(Optional) Seed Data:**
   ```bash
   # Update MONGODB_URI in backend/.env to Atlas URI
   python backend/seed_data/seed.py
   ```

### Post-Deployment Checklist

- ✅ Test authentication flow (register, login)
- ✅ Verify WebSocket connection (check browser console)
- ✅ Test ride booking and matching
- ✅ Check CORS settings (ensure frontend can access backend)
- ✅ Monitor logs for errors
- ✅ Set up domain (optional)
- ✅ Enable HTTPS for secure WebSocket connections

---

## 🔧 Development Workflow

### Setting Up Development Environment

1. **Clone and Install** (see [Quick Start](#-quick-start))
2. **Run Both Servers Concurrently:**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn app.main:socket_app --reload --port 8888
   ```
3. **Hot Reload** — Both Vite and Uvicorn support hot reloading

### Code Formatting and Linting

**Frontend:**
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Type checking
npx tsc --noEmit
```

**Backend:**
```bash
# Format with Black (if configured)
black backend/app

# Type checking with mypy (if configured)
mypy backend/app
```

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make Changes** — Keep commits small and focused
3. **Commit with Meaningful Messages**
   ```bash
   git add .
   git commit -m "feat: add ride pooling algorithm"
   ```
4. **Push to Remote**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create Pull Request** on GitHub

### Pull Request Process

1. **Ensure Code Quality:**
   - ✅ All linting passes
   - ✅ TypeScript compiles without errors
   - ✅ No console errors in browser
2. **Write Clear PR Description:**
   - What does this PR do?
   - Why is this change needed?
   - How to test?
3. **Link Related Issues:** Use `Fixes #123` or `Closes #456`
4. **Request Review** from maintainers
5. **Address Feedback** and update PR
6. **Merge** after approval

### Testing (if configured)

```bash
# Frontend tests
npm run test

# Backend tests
cd backend
pytest
```

---



## 🛠 Troubleshooting

### MongoDB Connection Errors

**Problem:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
- ✅ Ensure MongoDB is running: `mongod` or start MongoDB service
- ✅ Check `MONGODB_URI` in backend `.env` file
- ✅ Verify MongoDB is listening on correct port (default: 27017)
- ✅ For Atlas: Check network access whitelist and credentials

### CORS Issues

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- ✅ Add frontend URL to `CORS_ORIGINS` in backend `.env`:
  ```bash
  CORS_ORIGINS=http://localhost:5173,http://localhost:3000
  ```
- ✅ Restart backend server after changing `.env`
- ✅ Check that backend is running on expected port (8888)

### WebSocket Connection Problems

**Problem:** WebSocket not connecting or disconnecting frequently

**Solutions:**
- ✅ Verify `VITE_WS_URL` in frontend `.env` matches backend URL
- ✅ Check browser console for WebSocket errors
- ✅ Ensure backend Socket.IO is properly configured in `app/main.py`
- ✅ For production: Use `wss://` (secure WebSocket) instead of `ws://`
- ✅ Check firewall/proxy settings blocking WebSocket connections

### Port Conflicts

**Problem:** `Error: listen EADDRINUSE: address already in use`

**Solutions:**
- ✅ **Frontend (5173):**
  ```bash
  # Use different port
  npm run dev -- --port 3000
  ```
- ✅ **Backend (8888):**
  ```bash
  # Use different port
  uvicorn app.main:socket_app --port 8889
  ```
- ✅ Kill existing process:
  ```bash
  # On macOS/Linux
  lsof -ti:5173 | xargs kill -9
  
  # On Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  ```

### JWT Token Issues

**Problem:** `401 Unauthorized` or `Invalid token`

**Solutions:**
- ✅ Clear browser localStorage and login again
- ✅ Check token expiration time (`ACCESS_TOKEN_EXPIRE_MINUTES`)
- ✅ Verify `JWT_SECRET` is set in backend `.env`
- ✅ Ensure `Authorization: Bearer <token>` header is sent correctly

### Build Failures

**Problem:** `npm run build` fails

**Solutions:**
- ✅ Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- ✅ Check for TypeScript errors: `npx tsc --noEmit`
- ✅ Ensure all environment variables are set (even for build)

### Python Virtual Environment Issues

**Problem:** `command not found: uvicorn` or import errors

**Solutions:**
- ✅ Activate virtual environment:
  ```bash
  source venv/bin/activate  # macOS/Linux
  venv\Scripts\activate     # Windows
  ```
- ✅ Reinstall dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- ✅ Verify Python version: `python --version` (should be 3.10+)

### Map Not Displaying

**Problem:** Leaflet map not rendering

**Solutions:**
- ✅ Include Leaflet CSS in `index.html` or import in component:
  ```tsx
  import 'leaflet/dist/leaflet.css';
  ```
- ✅ Check browser console for Leaflet errors
- ✅ Verify map container has defined height in CSS

### Still Having Issues?

- 📖 Check the [Documentation](./docs)
- 🐛 [Open an Issue](https://github.com/H0NEYP0T-466/RidePool-STRPS/issues)
- 💬 [Start a Discussion](https://github.com/H0NEYP0T-466/RidePool-STRPS/discussions)

---

## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, coding standards, and pull request guidance.

## 📜 License
Distributed under the [MIT License](./LICENSE).

## 🛡 Security
Security guidelines and reporting instructions are available in [SECURITY.md](./SECURITY.md).

## 📏 Code of Conduct
Participation in this project is governed by the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## 🛠 Tech Stack
**Languages**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Frameworks & Libraries**

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.0-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13.2-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Databases**

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

**DevOps / CI / Tools**

![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Automation-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![npm](https://img.shields.io/badge/npm-Registry-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Dev%20Server-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Cloud / Hosting**

![Self Hosted](https://img.shields.io/badge/Hosting-Self--managed-lightgrey?style=for-the-badge&logo=serverfault&logoColor=white)

## 📦 Dependencies & Packages
<details>
<summary>Runtime Dependencies</summary>

**Frontend**

[![react](https://img.shields.io/npm/v/react?style=for-the-badge&label=react)](https://www.npmjs.com/package/react)
[![react-dom](https://img.shields.io/npm/v/react-dom?style=for-the-badge&label=react-dom)](https://www.npmjs.com/package/react-dom)
[![react-router-dom](https://img.shields.io/npm/v/react-router-dom?style=for-the-badge&label=react-router-dom)](https://www.npmjs.com/package/react-router-dom)
[![axios](https://img.shields.io/npm/v/axios?style=for-the-badge&label=axios)](https://www.npmjs.com/package/axios)
[![leaflet](https://img.shields.io/npm/v/leaflet?style=for-the-badge&label=leaflet)](https://www.npmjs.com/package/leaflet)
[![socket.io-client](https://img.shields.io/npm/v/socket.io-client?style=for-the-badge&label=socket.io-client)](https://www.npmjs.com/package/socket.io-client)

**Backend**

[![fastapi](https://img.shields.io/pypi/v/fastapi?style=for-the-badge&label=fastapi)](https://pypi.org/project/fastapi/)
[![uvicorn](https://img.shields.io/pypi/v/uvicorn?style=for-the-badge&label=uvicorn)](https://pypi.org/project/uvicorn/)
[![pymongo](https://img.shields.io/pypi/v/pymongo?style=for-the-badge&label=pymongo)](https://pypi.org/project/pymongo/)
[![python-jose](https://img.shields.io/pypi/v/python-jose?style=for-the-badge&label=python-jose)](https://pypi.org/project/python-jose/)
[![bcrypt](https://img.shields.io/pypi/v/bcrypt?style=for-the-badge&label=bcrypt)](https://pypi.org/project/bcrypt/)
[![python-multipart](https://img.shields.io/pypi/v/python-multipart?style=for-the-badge&label=python-multipart)](https://pypi.org/project/python-multipart/)
[![python-socketio](https://img.shields.io/pypi/v/python-socketio?style=for-the-badge&label=python-socketio)](https://pypi.org/project/python-socketio/)
[![python-dotenv](https://img.shields.io/pypi/v/python-dotenv?style=for-the-badge&label=python-dotenv)](https://pypi.org/project/python-dotenv/)
[![pydantic](https://img.shields.io/pypi/v/pydantic?style=for-the-badge&label=pydantic)](https://pypi.org/project/pydantic/)
[![email-validator](https://img.shields.io/pypi/v/email-validator?style=for-the-badge&label=email-validator)](https://pypi.org/project/email-validator/)

</details>

<details>
<summary>Dev / Build / Test Dependencies</summary>

[![typescript](https://img.shields.io/npm/v/typescript?style=for-the-badge&label=typescript)](https://www.npmjs.com/package/typescript)
[![vite](https://img.shields.io/npm/v/vite?style=for-the-badge&label=vite)](https://www.npmjs.com/package/vite)
[![eslint](https://img.shields.io/npm/v/eslint?style=for-the-badge&label=eslint)](https://www.npmjs.com/package/eslint)
[![@typescript-eslint](https://img.shields.io/npm/v/typescript-eslint?style=for-the-badge&label=typescript-eslint)](https://www.npmjs.com/package/typescript-eslint)
[![@vitejs/plugin-react](https://img.shields.io/npm/v/@vitejs/plugin-react?style=for-the-badge&label=@vitejs/plugin-react)](https://www.npmjs.com/package/@vitejs/plugin-react)
[![@eslint/js](https://img.shields.io/npm/v/@eslint/js?style=for-the-badge&label=@eslint/js)](https://www.npmjs.com/package/@eslint/js)
[![eslint-plugin-react-hooks](https://img.shields.io/npm/v/eslint-plugin-react-hooks?style=for-the-badge&label=eslint-plugin-react-hooks)](https://www.npmjs.com/package/eslint-plugin-react-hooks)
[![eslint-plugin-react-refresh](https://img.shields.io/npm/v/eslint-plugin-react-refresh?style=for-the-badge&label=eslint-plugin-react-refresh)](https://www.npmjs.com/package/eslint-plugin-react-refresh)
[![globals](https://img.shields.io/npm/v/globals?style=for-the-badge&label=globals)](https://www.npmjs.com/package/globals)
[![@types/node](https://img.shields.io/npm/v/@types/node?style=for-the-badge&label=@types/node)](https://www.npmjs.com/package/@types/node)
[![@types/react](https://img.shields.io/npm/v/@types/react?style=for-the-badge&label=@types/react)](https://www.npmjs.com/package/@types/react)
[![@types/react-dom](https://img.shields.io/npm/v/@types/react-dom?style=for-the-badge&label=@types/react-dom)](https://www.npmjs.com/package/@types/react-dom)
[![@types/leaflet](https://img.shields.io/npm/v/@types/leaflet?style=for-the-badge&label=@types/leaflet)](https://www.npmjs.com/package/@types/leaflet)

No peer or optional dependencies detected.
</details>

<p align="center">Made with ❤ by H0NEYP0T-466</p>
