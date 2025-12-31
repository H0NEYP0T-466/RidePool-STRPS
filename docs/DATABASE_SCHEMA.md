# Database Schema

## Overview

RidePool STRPS uses MongoDB as its database. The database name is `strps` and contains the following collections:

- `users` - User accounts
- `drivers` - Driver profiles
- `rides` - Ride information
- `bookings` - User bookings
- `feedback` - User feedback and ratings

---

## Collections

### users

Stores all user accounts (riders, drivers, admins).

```javascript
{
  _id: ObjectId,
  name: String,            // Full name (required)
  email: String,           // Unique email address (required)
  phone: String,           // Phone number (required)
  password: String,        // Bcrypt hashed password (required)
  role: String,            // 'user' | 'driver' | 'admin' (required)
  profileImage: String,    // Profile image URL (optional)
  createdAt: Date,         // Account creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

**Indexes:**
- `email` (unique)
- `role`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "phone": "+923001234567",
  "password": "$2b$12$...",
  "role": "user",
  "profileImage": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### drivers

Stores driver-specific information. Linked to users collection.

```javascript
{
  _id: ObjectId,
  userId: String,          // Reference to users._id (required)
  vehicleType: String,     // 'Sedan' | 'SUV' | 'Mini-Van' | etc. (required)
  vehicleNumber: String,   // Vehicle registration number (required)
  licenseNumber: String,   // Driver's license number (required)
  currentLocation: {       // Current GPS location (optional)
    lat: Number,           // Latitude (-90 to 90)
    lng: Number            // Longitude (-180 to 180)
  },
  isAvailable: Boolean,    // Availability status (default: true)
  rating: Number,          // Average rating (0-5, default: 0)
  totalTrips: Number,      // Total completed trips (default: 0)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `isAvailable`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "vehicleType": "Sedan",
  "vehicleNumber": "LEA-1234",
  "licenseNumber": "DL-123456",
  "currentLocation": {
    "lat": 33.6844,
    "lng": 73.0479
  },
  "isAvailable": true,
  "rating": 4.5,
  "totalTrips": 150,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### rides

Stores ride information including passengers and route.

```javascript
{
  _id: ObjectId,
  driverId: String,        // Reference to drivers._id (optional until assigned)
  passengers: [{           // Array of passengers
    userId: String,        // Reference to users._id
    pickupLocation: {
      lat: Number,
      lng: Number,
      address: String
    },
    dropoffLocation: {
      lat: Number,
      lng: Number,
      address: String
    },
    status: String,        // 'pending' | 'picked' | 'dropped'
    fare: Number           // Individual fare
  }],
  isPooled: Boolean,       // Whether ride allows pooling
  status: String,          // 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'
  route: Array,            // Array of waypoints
  totalFare: Number,       // Sum of all passenger fares
  startTime: Date,         // When ride started (optional)
  endTime: Date,           // When ride ended (optional)
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `status`
- `driverId`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "driverId": "507f1f77bcf86cd799439012",
  "passengers": [
    {
      "userId": "507f1f77bcf86cd799439011",
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
      "status": "dropped",
      "fare": 2500.00
    }
  ],
  "isPooled": false,
  "status": "completed",
  "route": [],
  "totalFare": 2500.00,
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T14:00:00.000Z",
  "createdAt": "2024-01-01T09:30:00.000Z",
  "updatedAt": "2024-01-01T14:00:00.000Z"
}
```

---

### bookings

Stores user booking requests.

```javascript
{
  _id: ObjectId,
  userId: String,          // Reference to users._id (required)
  rideId: String,          // Reference to rides._id (optional until matched)
  pickupLocation: {
    lat: Number,
    lng: Number,
    address: String
  },
  dropoffLocation: {
    lat: Number,
    lng: Number,
    address: String
  },
  wantPooling: Boolean,    // User's pooling preference
  status: String,          // 'requested' | 'matched' | 'in-progress' | 'completed' | 'cancelled'
  fare: Number,            // Calculated fare
  paymentStatus: String,   // 'pending' | 'paid'
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `status`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439011",
  "rideId": "507f1f77bcf86cd799439013",
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
  "wantPooling": false,
  "status": "completed",
  "fare": 2500.00,
  "paymentStatus": "paid",
  "createdAt": "2024-01-01T09:30:00.000Z",
  "updatedAt": "2024-01-01T14:00:00.000Z"
}
```

---

### feedback

Stores user ratings and reviews.

```javascript
{
  _id: ObjectId,
  userId: String,          // Reference to users._id (required)
  rideId: String,          // Reference to rides._id (required)
  driverId: String,        // Reference to drivers._id (required)
  rating: Number,          // 1-5 rating (required)
  comment: String,         // Review comment (optional)
  createdAt: Date
}
```

**Indexes:**
- `driverId`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "userId": "507f1f77bcf86cd799439011",
  "rideId": "507f1f77bcf86cd799439013",
  "driverId": "507f1f77bcf86cd799439012",
  "rating": 5,
  "comment": "Excellent service! Very professional driver.",
  "createdAt": "2024-01-01T14:30:00.000Z"
}
```

---

## Relationships

```
users (1) ─────────────── (1) drivers
  │                           │
  │ userId                    │ driverId
  ▼                           ▼
bookings (N) ─── rideId ─── rides (N)
  │                           │
  │ userId                    │ driverId
  └─────────────┬─────────────┘
                │
                ▼
           feedback (N)
```

---

## Data Validation

### Email Format
- Must be valid email format
- Must be unique across all users

### Phone Format
- 10-15 digits
- Optional + prefix

### Password
- Minimum 6 characters
- Stored as bcrypt hash

### Location
- Latitude: -90 to 90
- Longitude: -180 to 180

### Rating
- Integer between 1 and 5

---

## Fare Calculation

```
Base Fare = 50 PKR
Per KM Rate = 15 PKR/km

Distance = Haversine distance between pickup and dropoff
Distance Fare = Distance × Per KM Rate
Total Fare = Base Fare + Distance Fare

If Pooling:
  Discount = Total Fare × 25%
  Final Fare = Total Fare - Discount
```
