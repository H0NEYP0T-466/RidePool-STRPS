"""
Seed data script for RidePool STRPS
Creates sample users, drivers, rides, bookings, and feedback
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from datetime import datetime, timedelta
import random
import bcrypt
from pymongo import MongoClient


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/strps")
client = MongoClient(MONGO_URI)
db = client.get_database()

# Pakistani cities coordinates
CITIES = {
    "Islamabad": {"lat": 33.6844, "lng": 73.0479},
    "Lahore": {"lat": 31.5204, "lng": 74.3587},
    "Karachi": {"lat": 24.8607, "lng": 67.0011},
    "Rawalpindi": {"lat": 33.5651, "lng": 73.0169},
    "Faisalabad": {"lat": 31.4504, "lng": 73.1350},
    "Multan": {"lat": 30.1575, "lng": 71.5249},
    "Peshawar": {"lat": 34.0151, "lng": 71.5249},
    "Hyderabad": {"lat": 25.3960, "lng": 68.3578},
}

# Sample data
PAKISTANI_NAMES = [
    "Ahmed Khan", "Fatima Ali", "Muhammad Hassan", "Ayesha Malik", "Usman Ahmed",
    "Zainab Shah", "Ali Raza", "Maryam Bibi", "Bilal Ahmad", "Sara Khan",
    "Hamza Iqbal", "Hira Noor", "Faisal Mahmood", "Amna Tariq", "Omar Farooq",
    "Sana Javed", "Asad Hussain", "Nadia Butt", "Kashif Saeed", "Rabia Aslam"
]

VEHICLE_TYPES = ["Sedan", "SUV", "Mini-Van", "Hatchback", "Compact"]

def clear_database():
    """Clear all collections"""
    db.users.delete_many({})
    db.drivers.delete_many({})
    db.rides.delete_many({})
    db.bookings.delete_many({})
    db.feedback.delete_many({})
    print("Database cleared")

def create_users():
    """Create 20 users: 10 regular users, 5 drivers, 5 admins"""
    users = []
    now = datetime.utcnow()
    
    # Regular users (10)
    for i in range(10):
        user = {
            "name": PAKISTANI_NAMES[i],
            "email": f"user{i+1}@ridepool.pk",
            "phone": f"+9230{random.randint(10000000, 99999999)}",
            "password": hash_password("password123"),
            "role": "user",
            "profileImage": None,
            "createdAt": now - timedelta(days=random.randint(1, 30)),
            "updatedAt": now
        }
        users.append(user)
    
    # Drivers (5)
    for i in range(5):
        user = {
            "name": PAKISTANI_NAMES[10 + i],
            "email": f"driver{i+1}@ridepool.pk",
            "phone": f"+9231{random.randint(10000000, 99999999)}",
            "password": hash_password("password123"),
            "role": "driver",
            "profileImage": None,
            "createdAt": now - timedelta(days=random.randint(1, 30)),
            "updatedAt": now
        }
        users.append(user)
    
    # Admins (5)
    for i in range(5):
        user = {
            "name": PAKISTANI_NAMES[15 + i],
            "email": f"admin{i+1}@ridepool.pk",
            "phone": f"+9232{random.randint(10000000, 99999999)}",
            "password": hash_password("password123"),
            "role": "admin",
            "profileImage": None,
            "createdAt": now - timedelta(days=random.randint(1, 30)),
            "updatedAt": now
        }
        users.append(user)
    
    result = db.users.insert_many(users)
    print(f"Created {len(result.inserted_ids)} users")
    return result.inserted_ids

def create_drivers(user_ids):
    """Create driver profiles for driver users"""
    drivers = []
    now = datetime.utcnow()
    
    # Get driver user IDs (indices 10-14)
    driver_user_ids = user_ids[10:15]
    cities = list(CITIES.keys())
    
    for i, user_id in enumerate(driver_user_ids):
        city = random.choice(cities)
        base_loc = CITIES[city]
        
        # Add some random offset to location
        lat = base_loc["lat"] + random.uniform(-0.05, 0.05)
        lng = base_loc["lng"] + random.uniform(-0.05, 0.05)
        
        driver = {
            "userId": str(user_id),
            "vehicleType": random.choice(VEHICLE_TYPES),
            "vehicleNumber": f"LEA-{random.randint(1000, 9999)}",
            "licenseNumber": f"DL-{random.randint(100000, 999999)}",
            "currentLocation": {"lat": lat, "lng": lng},
            "isAvailable": random.choice([True, True, True, False]),  # 75% available
            "rating": round(random.uniform(3.5, 5.0), 1),
            "totalTrips": random.randint(10, 200),
            "createdAt": now - timedelta(days=random.randint(1, 30)),
            "updatedAt": now
        }
        drivers.append(driver)
    
    result = db.drivers.insert_many(drivers)
    print(f"Created {len(result.inserted_ids)} drivers")
    return result.inserted_ids

def create_rides_and_bookings(user_ids, driver_ids):
    """Create sample rides and bookings"""
    rides = []
    bookings = []
    now = datetime.utcnow()
    
    # Get regular user IDs (indices 0-9)
    regular_user_ids = user_ids[:10]
    
    cities = list(CITIES.keys())
    statuses = ["requested", "accepted", "in-progress", "completed", "cancelled"]
    
    for i in range(15):
        # Random pickup and dropoff cities
        pickup_city = random.choice(cities)
        dropoff_city = random.choice([c for c in cities if c != pickup_city])
        
        pickup_loc = CITIES[pickup_city]
        dropoff_loc = CITIES[dropoff_city]
        
        # Add address info
        pickup = {
            "lat": pickup_loc["lat"] + random.uniform(-0.02, 0.02),
            "lng": pickup_loc["lng"] + random.uniform(-0.02, 0.02),
            "address": f"{random.randint(1, 500)} Main Street, {pickup_city}"
        }
        dropoff = {
            "lat": dropoff_loc["lat"] + random.uniform(-0.02, 0.02),
            "lng": dropoff_loc["lng"] + random.uniform(-0.02, 0.02),
            "address": f"{random.randint(1, 500)} Central Road, {dropoff_city}"
        }
        
        user_id = str(random.choice(regular_user_ids))
        driver_id = str(random.choice(driver_ids))
        is_pooled = random.choice([True, False])
        status = random.choice(statuses)
        
        base_fare = random.uniform(500, 3000)
        if is_pooled:
            base_fare *= 0.75  # 25% discount
        
        fare = round(base_fare, 2)
        
        ride = {
            "driverId": driver_id if status != "requested" else None,
            "passengers": [{
                "userId": user_id,
                "pickupLocation": pickup,
                "dropoffLocation": dropoff,
                "status": "dropped" if status == "completed" else ("picked" if status == "in-progress" else "pending"),
                "fare": fare
            }],
            "isPooled": is_pooled,
            "status": status,
            "route": [],
            "totalFare": fare,
            "startTime": now - timedelta(hours=random.randint(1, 48)) if status in ["in-progress", "completed"] else None,
            "endTime": now - timedelta(hours=random.randint(0, 24)) if status == "completed" else None,
            "createdAt": now - timedelta(hours=random.randint(1, 72)),
            "updatedAt": now
        }
        rides.append(ride)
    
    ride_results = db.rides.insert_many(rides)
    print(f"Created {len(ride_results.inserted_ids)} rides")
    
    # Create corresponding bookings
    for ride_id, ride in zip(ride_results.inserted_ids, rides):
        for passenger in ride["passengers"]:
            booking = {
                "userId": passenger["userId"],
                "rideId": str(ride_id) if ride["status"] != "requested" else None,
                "pickupLocation": passenger["pickupLocation"],
                "dropoffLocation": passenger["dropoffLocation"],
                "wantPooling": ride["isPooled"],
                "status": ride["status"] if ride["status"] in ["requested", "completed", "cancelled"] else ("matched" if ride["status"] in ["accepted"] else "in-progress"),
                "fare": passenger["fare"],
                "paymentStatus": "paid" if ride["status"] == "completed" else "pending",
                "createdAt": ride["createdAt"],
                "updatedAt": ride["updatedAt"]
            }
            bookings.append(booking)
    
    booking_results = db.bookings.insert_many(bookings)
    print(f"Created {len(booking_results.inserted_ids)} bookings")
    
    return ride_results.inserted_ids

def create_feedback(user_ids, driver_ids, ride_ids):
    """Create sample feedback for completed rides"""
    feedbacks = []
    now = datetime.utcnow()
    
    regular_user_ids = user_ids[:10]
    
    # Get completed rides
    completed_rides = list(db.rides.find({"status": "completed"}))
    
    for ride in completed_rides[:8]:  # Create feedback for first 8 completed rides
        if ride["passengers"]:
            feedback = {
                "userId": ride["passengers"][0]["userId"],
                "rideId": str(ride["_id"]),
                "driverId": ride["driverId"],
                "rating": random.randint(3, 5),
                "comment": random.choice([
                    "Great ride, very professional driver!",
                    "Good service, arrived on time.",
                    "Driver was friendly and helpful.",
                    "Smooth ride, clean vehicle.",
                    "Excellent experience, will use again!",
                    "Very comfortable journey.",
                    "Quick and efficient service.",
                    None
                ]),
                "createdAt": now - timedelta(hours=random.randint(0, 48))
            }
            feedbacks.append(feedback)
    
    if feedbacks:
        result = db.feedback.insert_many(feedbacks)
        print(f"Created {len(result.inserted_ids)} feedback entries")
    else:
        print("No completed rides to add feedback")

def create_indexes():
    """Create database indexes for performance"""
    db.users.create_index("email", unique=True)
    db.users.create_index("role")
    db.drivers.create_index("userId")
    db.drivers.create_index("isAvailable")
    db.rides.create_index("status")
    db.rides.create_index("driverId")
    db.bookings.create_index("userId")
    db.bookings.create_index("status")
    db.feedback.create_index("driverId")
    print("Database indexes created")

def main():
    print("Starting seed data creation...")
    print(f"Database: {db.name}")
    
    clear_database()
    user_ids = create_users()
    driver_ids = create_drivers(user_ids)
    ride_ids = create_rides_and_bookings(user_ids, driver_ids)
    create_feedback(user_ids, driver_ids, ride_ids)
    create_indexes()
    
    print("\nSeed data creation completed!")
    print("\nTest Credentials:")
    print("================")
    print("User: user1@ridepool.pk / password123")
    print("Driver: driver1@ridepool.pk / password123")
    print("Admin: admin1@ridepool.pk / password123")

if __name__ == "__main__":
    main()
