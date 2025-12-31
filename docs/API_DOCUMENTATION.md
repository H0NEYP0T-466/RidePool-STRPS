# API Documentation

## Base URL

```
http://localhost:8888
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens expire after 1 hour (3600 seconds).

---

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+923001234567",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+923001234567",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00",
      "updatedAt": "2024-01-01T00:00:00"
    },
    "token": "eyJ..."
  }
}
```

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJ..."
  }
}
```

### Logout

```http
POST /api/auth/logout
```

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Get Current User

```http
GET /api/auth/me
```

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+923001234567",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
}
```

---

## User Endpoints

### Get Profile

```http
GET /api/user/profile
```

**Headers:** Authorization required

### Update Profile

```http
PUT /api/user/profile
```

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+923009876543"
}
```

### Request Ride

```http
POST /api/user/ride/request
```

**Headers:** Authorization required

**Request Body:**
```json
{
  "pickupLocation": {
    "lat": 33.6844,
    "lng": 73.0479,
    "address": "Blue Area, Islamabad"
  },
  "dropoffLocation": {
    "lat": 31.5204,
    "lng": 74.3587,
    "address": "Gulberg, Lahore"
  },
  "wantPooling": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ride requested successfully",
  "data": {
    "bookingId": "...",
    "userId": "...",
    "pickupLocation": { ... },
    "dropoffLocation": { ... },
    "wantPooling": true,
    "status": "requested",
    "fareInfo": {
      "distance": 275.5,
      "baseFare": 50,
      "distanceFare": 4132.5,
      "discount": 1045.63,
      "totalFare": 3136.87
    },
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

### Get User Rides

```http
GET /api/user/rides
```

**Headers:** Authorization required

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

### Get Ride Details

```http
GET /api/user/rides/:id
```

**Headers:** Authorization required

---

## Driver Endpoints

### Get Driver Profile

```http
GET /api/driver/profile
```

**Headers:** Authorization required (driver/admin role)

### Update Location

```http
PUT /api/driver/location
```

**Headers:** Authorization required (driver/admin role)

**Request Body:**
```json
{
  "lat": 33.6844,
  "lng": 73.0479
}
```

### Get Ride Requests

```http
GET /api/driver/ride-requests
```

**Headers:** Authorization required (driver/admin role)

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page

### Accept Ride

```http
POST /api/driver/ride/:bookingId/accept
```

**Headers:** Authorization required (driver/admin role)

### Reject Ride

```http
POST /api/driver/ride/:bookingId/reject
```

**Headers:** Authorization required (driver/admin role)

### Update Ride Status

```http
PUT /api/driver/ride/:rideId/status
```

**Headers:** Authorization required (driver/admin role)

**Query Parameters:**
- `status`: "in-progress" | "completed" | "cancelled"

### Get Driver Rides

```http
GET /api/driver/rides
```

**Headers:** Authorization required (driver/admin role)

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Results per page

---

## Ride Endpoints

### Find Pool Matches

```http
POST /api/rides/match
```

**Query Parameters:**
- `pickup_lat`: Pickup latitude
- `pickup_lng`: Pickup longitude
- `dropoff_lat`: Dropoff latitude
- `dropoff_lng`: Dropoff longitude
- `max_deviation` (optional): Maximum route deviation in km

### Get Nearby Drivers

```http
GET /api/rides/nearby-drivers
```

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude
- `radius` (optional): Search radius in km (default: 10)

### Get Ride Details

```http
GET /api/rides/:id
```

---

## Admin Endpoints

### Get Dashboard

```http
GET /api/admin/dashboard
```

**Headers:** Authorization required (admin role)

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalUsers": 10,
      "totalDrivers": 5,
      "totalRides": 15,
      "activeRides": 3,
      "completedRides": 10,
      "totalRevenue": 25000.50,
      "averageRating": 4.5
    },
    "recentRides": [ ... ]
  }
}
```

### Get All Trips

```http
GET /api/admin/trips
```

**Headers:** Authorization required (admin role)

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Results per page

### Get All Users

```http
GET /api/admin/users
```

**Headers:** Authorization required (admin role)

**Query Parameters:**
- `role` (optional): Filter by role
- `page` (optional): Page number
- `limit` (optional): Results per page

### Get All Drivers

```http
GET /api/admin/drivers
```

**Headers:** Authorization required (admin role)

**Query Parameters:**
- `available` (optional): Filter by availability
- `page` (optional): Page number
- `limit` (optional): Results per page

### Get Payment Reports

```http
GET /api/admin/payments
```

**Headers:** Authorization required (admin role)

### Get All Feedback

```http
GET /api/admin/feedback
```

**Headers:** Authorization required (admin role)

### Submit Feedback

```http
POST /api/admin/feedback
```

**Headers:** Authorization required

**Request Body:**
```json
{
  "rideId": "...",
  "driverId": "...",
  "rating": 5,
  "comment": "Great ride!"
}
```

---

## WebSocket Events

### Client to Server

| Event | Data | Description |
|-------|------|-------------|
| `join_room` | `{ userId, type }` | Join user/driver room |
| `leave_room` | `{ userId, type }` | Leave room |
| `join_ride_room` | `{ rideId }` | Join ride tracking room |
| `leave_ride_room` | `{ rideId }` | Leave ride room |
| `location_update` | `{ driverId, lat, lng, rideId }` | Driver location update |
| `ride_status_update` | `{ rideId, status }` | Update ride status |

### Server to Client

| Event | Data | Description |
|-------|------|-------------|
| `new_ride_request` | `{ bookingId, ... }` | New ride request for driver |
| `ride_accepted` | `{ rideId, ... }` | Ride accepted notification |
| `ride_started` | `{ rideId, ... }` | Ride started notification |
| `ride_completed` | `{ rideId, ... }` | Ride completed notification |
| `driver_location` | `{ driverId, lat, lng, timestamp }` | Driver location update |
| `ride_status_changed` | `{ rideId, status, timestamp }` | Status change notification |
| `pool_match_found` | `{ ... }` | Pool match found notification |

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message here"
}
```

Common HTTP status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "RidePool STRPS API is running"
}
```
