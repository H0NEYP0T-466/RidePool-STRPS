# RidePool STRPS - Smart Transportation & Ride-Pooling System

A full-stack ride-pooling system with user app, driver module, and admin panel. This system allows users to request rides, pool with others on similar routes, drivers to accept and manage rides, and admins to monitor the entire system.

## Features

### User Features
- 🚗 Request rides with pickup and dropoff locations
- 👥 Enable pooling to share rides and save money
- 📍 Real-time driver tracking on map
- 📋 View ride history and past trips
- ⭐ Rate drivers after ride completion

### Driver Features
- 📲 Receive real-time ride requests
- ✅ Accept or reject rides
- 🗺️ Route optimization for multiple pickups
- 📊 View earnings and trip statistics
- 🔄 Update ride status (in-progress, completed)

### Admin Features
- 📈 Dashboard with key metrics
- 🚕 Monitor all trips (active, completed, cancelled)
- 👥 User and driver management
- 💰 Payment reports and analytics
- ⭐ Feedback dashboard with ratings

## Tech Stack

### Frontend
- React 18+ with TypeScript
- React Router for navigation
- Pure CSS (no frameworks)
- Leaflet for maps
- Axios for API calls
- Socket.IO client for real-time updates

### Backend
- Python 3.10+
- FastAPI framework
- MongoDB database
- PyMongo for database operations
- JWT authentication
- Socket.IO for WebSockets

## Project Structure

```
ridepool-strps/
├── frontend/               # React frontend (src/)
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── common/    # Shared components
│   │   │   ├── user/      # User module
│   │   │   ├── driver/    # Driver module
│   │   │   └── admin/     # Admin module
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and socket services
│   │   ├── context/       # React contexts
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── models/        # Pydantic models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities
│   │   ├── websocket/     # Socket.IO handlers
│   │   └── main.py        # FastAPI app
│   ├── seed_data/         # Database seeding
│   └── requirements.txt
└── docs/                  # Documentation
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (copy .env.example to .env)
cp .env.example .env

# Run seed data
python seed_data/seed.py

# Start server
uvicorn app.main:socket_app --host 0.0.0.0 --port 8888 --reload
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8888
VITE_SOCKET_URL=http://localhost:8888
```

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/strps
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=3600
PORT=8888
CORS_ORIGINS=*
```

## Test Credentials

After running the seed script:

| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| User   | user1@ridepool.pk      | password123 |
| Driver | driver1@ridepool.pk    | password123 |
| Admin  | admin1@ridepool.pk     | password123 |

## API Documentation

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for detailed API endpoints.

## Database Schema

See [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) for collection structures.

## Cities Covered

- Islamabad
- Lahore
- Karachi
- Rawalpindi
- Faisalabad
- Multan
- Peshawar
- Hyderabad

## License

MIT License
