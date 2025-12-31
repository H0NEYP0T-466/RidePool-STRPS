from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from app.utils.database import get_database
from app.services.ride_matching import find_pool_matches, find_nearby_drivers

router = APIRouter(prefix="/api/rides", tags=["Rides"])


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
