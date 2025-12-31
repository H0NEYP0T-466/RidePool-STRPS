from fastapi import APIRouter, HTTPException, Query, Depends
from bson import ObjectId
from typing import Optional
from app.utils.database import get_database
from app.services.ride_matching import find_pool_matches, find_nearby_drivers, haversine_distance
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/rides", tags=["Rides"])


@router.get("/available-pools")
async def get_available_pools(
    lat: float = Query(None, ge=-90, le=90),
    lng: float = Query(None, ge=-180, le=180),
    radius: float = Query(20.0, ge=1, le=100),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: Optional[dict] = Depends(get_current_user)
):
    """Get available pooling rides that users can join."""
    db = get_database()
    
    # Find rides that accept pooling and are not full
    query = {
        "isPooled": True,
        "status": {"$in": ["requested", "accepted"]},
        "$expr": {"$lt": [{"$size": "$passengers"}, 4]}  # Max 4 passengers
    }
    
    skip = (page - 1) * limit
    
    rides = list(db.rides.find(query).sort("createdAt", -1).skip(skip).limit(limit))
    
    # Also find requested bookings that want pooling (not yet matched to a ride)
    pooling_bookings = list(db.bookings.find({
        "wantPooling": True,
        "status": "requested",
        "rideId": None
    }).sort("createdAt", -1).skip(skip).limit(limit))
    
    total_rides = db.rides.count_documents(query)
    total_bookings = db.bookings.count_documents({
        "wantPooling": True,
        "status": "requested",
        "rideId": None
    })
    
    available_pools = []
    
    # Process active rides
    for ride in rides:
        if not ride.get("passengers"):
            continue
        
        first_passenger = ride["passengers"][0]
        pickup = first_passenger.get("pickupLocation", {})
        dropoff = first_passenger.get("dropoffLocation", {})
        
        # Skip if no location or if user is already in this ride
        if not pickup or not dropoff:
            continue
        
        # Check if current user is already a passenger
        user_in_ride = False
        if current_user:
            for p in ride.get("passengers", []):
                if p.get("userId") == current_user.get("id"):
                    user_in_ride = True
                    break
        
        if user_in_ride:
            continue
        
        # Filter by proximity if coordinates provided
        if lat is not None and lng is not None:
            distance = haversine_distance(lat, lng, pickup["lat"], pickup["lng"])
            if distance > radius:
                continue
        else:
            distance = None
        
        # Get driver info if available
        driver_info = None
        if ride.get("driverId"):
            driver = db.drivers.find_one({"_id": ObjectId(ride["driverId"])})
            if driver:
                user = db.users.find_one({"_id": ObjectId(driver["userId"])})
                driver_info = {
                    "name": user["name"] if user else "Unknown",
                    "vehicleType": driver["vehicleType"],
                    "rating": driver.get("rating", 0)
                }
        
        available_pools.append({
            "type": "ride",
            "id": str(ride["_id"]),
            "pickupLocation": pickup,
            "dropoffLocation": dropoff,
            "currentPassengers": len(ride.get("passengers", [])),
            "maxPassengers": 4,
            "status": ride["status"],
            "driver": driver_info,
            "distance": round(distance, 2) if distance else None,
            "createdAt": ride["createdAt"].isoformat() if ride.get("createdAt") else None
        })
    
    # Process pooling bookings
    for booking in pooling_bookings:
        pickup = booking.get("pickupLocation", {})
        dropoff = booking.get("dropoffLocation", {})
        
        if not pickup or not dropoff:
            continue
        
        # Skip if this is the current user's booking
        if current_user and booking.get("userId") == current_user.get("id"):
            continue
        
        # Filter by proximity if coordinates provided
        if lat is not None and lng is not None:
            distance = haversine_distance(lat, lng, pickup["lat"], pickup["lng"])
            if distance > radius:
                continue
        else:
            distance = None
        
        # Get user info
        user = db.users.find_one({"_id": ObjectId(booking["userId"])})
        user_name = user["name"] if user else "Unknown"
        
        available_pools.append({
            "type": "booking",
            "id": str(booking["_id"]),
            "pickupLocation": pickup,
            "dropoffLocation": dropoff,
            "currentPassengers": 1,
            "maxPassengers": 4,
            "status": booking["status"],
            "userName": user_name,
            "distance": round(distance, 2) if distance else None,
            "createdAt": booking["createdAt"].isoformat() if booking.get("createdAt") else None
        })
    
    # Sort by distance if available
    if lat is not None and lng is not None:
        available_pools.sort(key=lambda x: x.get("distance") or float("inf"))
    
    return {
        "success": True,
        "data": {
            "pools": available_pools,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total_rides + total_bookings,
                "pages": ((total_rides + total_bookings) + limit - 1) // limit
            }
        }
    }


@router.post("/join-pool/{pool_id}")
async def join_pool(
    pool_id: str,
    pickup_lat: float = Query(..., ge=-90, le=90),
    pickup_lng: float = Query(..., ge=-180, le=180),
    dropoff_lat: float = Query(..., ge=-90, le=90),
    dropoff_lng: float = Query(..., ge=-180, le=180),
    pickup_address: str = Query(""),
    dropoff_address: str = Query(""),
    current_user: dict = Depends(get_current_user)
):
    """Join an existing pooling ride."""
    from datetime import datetime
    from app.services.payment_service import calculate_fare
    
    db = get_database()
    
    # Calculate fare for the new passenger
    fare_info = calculate_fare(
        pickup_lat, pickup_lng,
        dropoff_lat, dropoff_lng,
        True  # pooling discount
    )
    
    try:
        # Try to find as ride first
        ride = db.rides.find_one({"_id": ObjectId(pool_id)})
        
        if ride:
            # Check if ride is still open for pooling
            if not ride.get("isPooled"):
                raise HTTPException(status_code=400, detail="This ride doesn't accept pooling")
            
            if ride["status"] not in ["requested", "accepted"]:
                raise HTTPException(status_code=400, detail="This ride is no longer available for pooling")
            
            if len(ride.get("passengers", [])) >= 4:
                raise HTTPException(status_code=400, detail="This pool is full")
            
            # Check if user is already in the ride
            for p in ride.get("passengers", []):
                if p.get("userId") == current_user["id"]:
                    raise HTTPException(status_code=400, detail="You are already in this pool")
            
            now = datetime.utcnow()
            
            # Add user as a new passenger
            new_passenger = {
                "userId": current_user["id"],
                "pickupLocation": {
                    "lat": pickup_lat,
                    "lng": pickup_lng,
                    "address": pickup_address
                },
                "dropoffLocation": {
                    "lat": dropoff_lat,
                    "lng": dropoff_lng,
                    "address": dropoff_address
                },
                "status": "pending",
                "fare": fare_info["totalFare"]
            }
            
            # Update ride with new passenger
            db.rides.update_one(
                {"_id": ObjectId(pool_id)},
                {
                    "$push": {"passengers": new_passenger},
                    "$inc": {"totalFare": fare_info["totalFare"]},
                    "$set": {"updatedAt": now}
                }
            )
            
            # Create a booking for this user
            booking_doc = {
                "userId": current_user["id"],
                "rideId": pool_id,
                "pickupLocation": new_passenger["pickupLocation"],
                "dropoffLocation": new_passenger["dropoffLocation"],
                "wantPooling": True,
                "status": "matched",
                "fare": fare_info["totalFare"],
                "paymentStatus": "pending",
                "createdAt": now,
                "updatedAt": now
            }
            
            result = db.bookings.insert_one(booking_doc)
            
            return {
                "success": True,
                "message": "Successfully joined the pool!",
                "data": {
                    "bookingId": str(result.inserted_id),
                    "rideId": pool_id,
                    "fareInfo": fare_info
                }
            }
        else:
            # Try to find as a booking (user wants to pool with another user's booking)
            existing_booking = db.bookings.find_one({"_id": ObjectId(pool_id)})
            
            if not existing_booking:
                raise HTTPException(status_code=404, detail="Pool not found")
            
            if not existing_booking.get("wantPooling"):
                raise HTTPException(status_code=400, detail="This booking doesn't accept pooling")
            
            if existing_booking["status"] != "requested":
                raise HTTPException(status_code=400, detail="This booking is no longer available for pooling")
            
            now = datetime.utcnow()
            
            # Create a new ride that combines both bookings
            ride_doc = {
                "driverId": None,
                "passengers": [
                    {
                        "userId": existing_booking["userId"],
                        "pickupLocation": existing_booking["pickupLocation"],
                        "dropoffLocation": existing_booking["dropoffLocation"],
                        "status": "pending",
                        "fare": existing_booking["fare"]
                    },
                    {
                        "userId": current_user["id"],
                        "pickupLocation": {
                            "lat": pickup_lat,
                            "lng": pickup_lng,
                            "address": pickup_address
                        },
                        "dropoffLocation": {
                            "lat": dropoff_lat,
                            "lng": dropoff_lng,
                            "address": dropoff_address
                        },
                        "status": "pending",
                        "fare": fare_info["totalFare"]
                    }
                ],
                "isPooled": True,
                "status": "requested",
                "route": [],
                "totalFare": existing_booking["fare"] + fare_info["totalFare"],
                "startTime": None,
                "endTime": None,
                "createdAt": now,
                "updatedAt": now
            }
            
            ride_result = db.rides.insert_one(ride_doc)
            ride_id = str(ride_result.inserted_id)
            
            # Update existing booking
            db.bookings.update_one(
                {"_id": ObjectId(pool_id)},
                {
                    "$set": {
                        "rideId": ride_id,
                        "status": "matched",
                        "updatedAt": now
                    }
                }
            )
            
            # Create new booking for current user
            new_booking_doc = {
                "userId": current_user["id"],
                "rideId": ride_id,
                "pickupLocation": {
                    "lat": pickup_lat,
                    "lng": pickup_lng,
                    "address": pickup_address
                },
                "dropoffLocation": {
                    "lat": dropoff_lat,
                    "lng": dropoff_lng,
                    "address": dropoff_address
                },
                "wantPooling": True,
                "status": "matched",
                "fare": fare_info["totalFare"],
                "paymentStatus": "pending",
                "createdAt": now,
                "updatedAt": now
            }
            
            result = db.bookings.insert_one(new_booking_doc)
            
            return {
                "success": True,
                "message": "Successfully joined the pool! A new pooled ride has been created.",
                "data": {
                    "bookingId": str(result.inserted_id),
                    "rideId": ride_id,
                    "fareInfo": fare_info
                }
            }
            
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"Failed to join pool: {str(e)}")


@router.post("/match")
async def find_matches(
    pickup_lat: float = Query(..., ge=-90, le=90),
    pickup_lng: float = Query(..., ge=-180, le=180),
    dropoff_lat: float = Query(..., ge=-90, le=90),
    dropoff_lng: float = Query(..., ge=-180, le=180),
    max_deviation: float = Query(5.0, ge=0, le=20)
):
    """Find pool matches for a ride request."""
    pickup = {"lat": pickup_lat, "lng": pickup_lng}
    dropoff = {"lat": dropoff_lat, "lng": dropoff_lng}
    
    matches = find_pool_matches(pickup, dropoff, max_deviation)
    
    return {
        "success": True,
        "data": {
            "matches": matches,
            "count": len(matches)
        }
    }


@router.get("/nearby-drivers")
async def get_nearby_drivers(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius: float = Query(10.0, ge=1, le=50)
):
    """Get available drivers within a specified radius."""
    drivers = find_nearby_drivers(lat, lng, radius)
    
    return {
        "success": True,
        "data": {
            "drivers": drivers,
            "count": len(drivers)
        }
    }


@router.get("/{ride_id}")
async def get_ride(ride_id: str):
    """Get ride details by ID."""
    db = get_database()
    
    try:
        ride = db.rides.find_one({"_id": ObjectId(ride_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ride ID")
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    ride["id"] = str(ride.pop("_id"))
    if ride.get("createdAt"):
        ride["createdAt"] = ride["createdAt"].isoformat()
    if ride.get("updatedAt"):
        ride["updatedAt"] = ride["updatedAt"].isoformat()
    if ride.get("startTime"):
        ride["startTime"] = ride["startTime"].isoformat()
    if ride.get("endTime"):
        ride["endTime"] = ride["endTime"].isoformat()
    
    # Get driver info
    driver_info = None
    if ride.get("driverId"):
        driver = db.drivers.find_one({"_id": ObjectId(ride["driverId"])})
        if driver:
            user = db.users.find_one({"_id": ObjectId(driver["userId"])})
            driver_info = {
                "id": str(driver["_id"]),
                "name": user["name"] if user else "Unknown",
                "vehicleType": driver["vehicleType"],
                "vehicleNumber": driver["vehicleNumber"],
                "rating": driver.get("rating", 0),
                "currentLocation": driver.get("currentLocation")
            }
    
    return {
        "success": True,
        "data": {
            "ride": ride,
            "driver": driver_info
        }
    }
