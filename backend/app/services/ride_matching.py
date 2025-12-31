import math
from typing import List
from bson import ObjectId
from app.utils.database import get_database


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate the distance between two points in kilometers."""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = math.sin(delta_lat / 2) ** 2 + \
        math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


def calculate_route_deviation(
    original_pickup: dict,
    original_dropoff: dict,
    new_pickup: dict,
    new_dropoff: dict
) -> float:
    """Calculate how much the route deviates when adding a new passenger."""
    original_distance = haversine_distance(
        original_pickup["lat"], original_pickup["lng"],
        original_dropoff["lat"], original_dropoff["lng"]
    )
    
    # Route with new passenger: original pickup -> new pickup -> new dropoff -> original dropoff
    new_distance = (
        haversine_distance(
            original_pickup["lat"], original_pickup["lng"],
            new_pickup["lat"], new_pickup["lng"]
        ) +
        haversine_distance(
            new_pickup["lat"], new_pickup["lng"],
            new_dropoff["lat"], new_dropoff["lng"]
        ) +
        haversine_distance(
            new_dropoff["lat"], new_dropoff["lng"],
            original_dropoff["lat"], original_dropoff["lng"]
        )
    )
    
    return new_distance - original_distance


def find_pool_matches(
    pickup: dict,
    dropoff: dict,
    max_deviation_km: float = 5.0,
    max_results: int = 5
) -> List[dict]:
    """Find existing rides that can accommodate a new pooling passenger."""
    db = get_database()
    
    # Find active rides that accept pooling
    active_rides = db.rides.find({
        "isPooled": True,
        "status": {"$in": ["requested", "accepted", "in-progress"]},
        "$expr": {"$lt": [{"$size": "$passengers"}, 4]}  # Max 4 passengers per pool
    })
    
    matches = []
    for ride in active_rides:
        if not ride.get("passengers"):
            continue
        
        # Use the first passenger's route as reference
        first_passenger = ride["passengers"][0]
        original_pickup = first_passenger.get("pickupLocation", {})
        original_dropoff = first_passenger.get("dropoffLocation", {})
        
        if not original_pickup or not original_dropoff:
            continue
        
        deviation = calculate_route_deviation(
            original_pickup, original_dropoff,
            pickup, dropoff
        )
        
        if deviation <= max_deviation_km:
            # Calculate discount (more passengers = more discount)
            passenger_count = len(ride["passengers"])
            discount_percentage = min(30, 10 + (passenger_count * 5))
            
            matches.append({
                "rideId": str(ride["_id"]),
                "driverId": ride.get("driverId"),
                "currentPassengers": passenger_count,
                "deviation": round(deviation, 2),
                "discountPercentage": discount_percentage
            })
    
    # Sort by deviation (closest matches first)
    matches.sort(key=lambda x: x["deviation"])
    return matches[:max_results]


def find_nearby_drivers(lat: float, lng: float, radius_km: float = 10.0, limit: int = 10) -> List[dict]:
    """Find available drivers within a given radius."""
    db = get_database()
    
    available_drivers = db.drivers.find({
        "isAvailable": True,
        "currentLocation": {"$ne": None}
    })
    
    nearby = []
    for driver in available_drivers:
        loc = driver.get("currentLocation")
        if not loc:
            continue
        
        distance = haversine_distance(lat, lng, loc["lat"], loc["lng"])
        
        if distance <= radius_km:
            # Get driver's user info
            user = db.users.find_one({"_id": ObjectId(driver["userId"])})
            user_name = user["name"] if user else "Unknown"
            
            nearby.append({
                "driverId": str(driver["_id"]),
                "userId": str(driver["userId"]),
                "name": user_name,
                "vehicleType": driver["vehicleType"],
                "vehicleNumber": driver["vehicleNumber"],
                "rating": driver.get("rating", 0),
                "totalTrips": driver.get("totalTrips", 0),
                "distance": round(distance, 2),
                "location": loc
            })
    
    # Sort by distance (closest first)
    nearby.sort(key=lambda x: x["distance"])
    return nearby[:limit]
