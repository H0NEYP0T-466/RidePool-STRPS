from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional
from app.routes.auth import get_current_user
from app.utils.database import get_database
from app.models.driver import DriverCreate, DriverUpdate, DriverLocationUpdate

router = APIRouter(prefix="/api/driver", tags=["Driver"])


def get_driver_user(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["driver", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied. Driver role required.")
    return current_user


def get_or_create_driver_profile(user_id: str, db):
    """Get driver profile or create one if it doesn't exist"""
    driver = db.drivers.find_one({"userId": user_id})
    
    if not driver:
        now = datetime.utcnow()
        driver_doc = {
            "userId": user_id,
            "vehicleType": "Sedan",
            "vehicleNumber": "PENDING",
            "licenseNumber": "PENDING",
            "currentLocation": None,
            "isAvailable": False,
            "rating": 0.0,
            "totalTrips": 0,
            "createdAt": now,
            "updatedAt": now
        }
        result = db.drivers.insert_one(driver_doc)
        driver = db.drivers.find_one({"_id": result.inserted_id})
    
    return driver


@router.get("/profile")
async def get_driver_profile(current_user: dict = Depends(get_driver_user)):
    db = get_database()
    driver = get_or_create_driver_profile(current_user["id"], db)
    
    driver["id"] = str(driver.pop("_id"))
    if driver.get("createdAt"):
        driver["createdAt"] = driver["createdAt"].isoformat()
    if driver.get("updatedAt"):
        driver["updatedAt"] = driver["updatedAt"].isoformat()
    
    return {
        "success": True,
        "data": {
            "driver": driver,
            "user": current_user
        }
    }


@router.put("/profile")
async def update_driver_profile(
    update_data: DriverUpdate,
    current_user: dict = Depends(get_driver_user)
):
    db = get_database()
    
    # Get or create driver profile
    driver = get_or_create_driver_profile(current_user["id"], db)
    
    # Build update document
    update_doc = {}
    if update_data.vehicleType is not None:
        update_doc["vehicleType"] = update_data.vehicleType
    if update_data.vehicleNumber is not None:
        update_doc["vehicleNumber"] = update_data.vehicleNumber
    if update_data.licenseNumber is not None:
        update_doc["licenseNumber"] = update_data.licenseNumber
    if update_data.isAvailable is not None:
        update_doc["isAvailable"] = update_data.isAvailable
    
    if not update_doc:
        return {
            "success": True,
            "message": "No changes to update",
            "data": {"driver": driver}
        }
    
    update_doc["updatedAt"] = datetime.utcnow()
    
    result = db.drivers.find_one_and_update(
        {"_id": driver["_id"]},
        {"$set": update_doc},
        return_document=True
    )
    
    result["id"] = str(result.pop("_id"))
    if result.get("createdAt"):
        result["createdAt"] = result["createdAt"].isoformat()
    if result.get("updatedAt"):
        result["updatedAt"] = result["updatedAt"].isoformat()
    
    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": {"driver": result}
    }


@router.put("/location")
async def update_location(
    location: DriverLocationUpdate,
    current_user: dict = Depends(get_driver_user)
):
    db = get_database()
    
    # Ensure driver profile exists
    driver = get_or_create_driver_profile(current_user["id"], db)
    
    result = db.drivers.find_one_and_update(
        {"_id": driver["_id"]},
        {
            "$set": {
                "currentLocation": {"lat": location.lat, "lng": location.lng},
                "updatedAt": datetime.utcnow()
            }
        },
        return_document=True
    )
    
    return {
        "success": True,
        "message": "Location updated successfully",
        "data": {
            "lat": location.lat,
            "lng": location.lng
        }
    }


@router.get("/ride-requests")
async def get_pending_ride_requests(
    current_user: dict = Depends(get_driver_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    db = get_database()
    
    # Get or create driver profile
    driver = get_or_create_driver_profile(current_user["id"], db)
    
    skip = (page - 1) * limit
    
    # Find pending bookings
    bookings = list(db.bookings.find({
        "status": "requested",
        "rideId": None
    }).sort("createdAt", -1).skip(skip).limit(limit))
    
    total = db.bookings.count_documents({"status": "requested", "rideId": None})
    
    requests = []
    for booking in bookings:
        user = db.users.find_one({"_id": ObjectId(booking["userId"])})
        requests.append({
            "bookingId": str(booking["_id"]),
            "userId": booking["userId"],
            "userName": user["name"] if user else "Unknown",
            "pickupLocation": booking["pickupLocation"],
            "dropoffLocation": booking["dropoffLocation"],
            "wantPooling": booking["wantPooling"],
            "fare": booking["fare"],
            "createdAt": booking["createdAt"].isoformat() if booking.get("createdAt") else None
        })
    
    return {
        "success": True,
        "data": {
            "requests": requests,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    }


@router.post("/ride/{booking_id}/accept")
async def accept_ride(
    booking_id: str,
    current_user: dict = Depends(get_driver_user)
):
    db = get_database()
    
    # Get or create driver
    driver = get_or_create_driver_profile(current_user["id"], db)
    
    # Get booking
    try:
        booking = db.bookings.find_one({"_id": ObjectId(booking_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid booking ID")
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["status"] != "requested":
        raise HTTPException(status_code=400, detail="Booking is no longer available")
    
    now = datetime.utcnow()
    
    # Create a new ride
    ride_doc = {
        "driverId": str(driver["_id"]),
        "passengers": [{
            "userId": booking["userId"],
            "pickupLocation": booking["pickupLocation"],
            "dropoffLocation": booking["dropoffLocation"],
            "status": "pending",
            "fare": booking["fare"]
        }],
        "isPooled": booking["wantPooling"],
        "status": "accepted",
        "route": [],
        "totalFare": booking["fare"],
        "startTime": None,
        "endTime": None,
        "createdAt": now,
        "updatedAt": now
    }
    
    ride_result = db.rides.insert_one(ride_doc)
    ride_id = str(ride_result.inserted_id)
    
    # Update booking
    db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {
            "$set": {
                "rideId": ride_id,
                "status": "matched",
                "updatedAt": now
            }
        }
    )
    
    # Mark driver as unavailable
    db.drivers.update_one(
        {"_id": driver["_id"]},
        {"$set": {"isAvailable": False, "updatedAt": now}}
    )
    
    return {
        "success": True,
        "message": "Ride accepted successfully",
        "data": {
            "rideId": ride_id,
            "bookingId": booking_id,
            "passenger": {
                "userId": booking["userId"],
                "pickupLocation": booking["pickupLocation"],
                "dropoffLocation": booking["dropoffLocation"]
            }
        }
    }


@router.post("/ride/{booking_id}/reject")
async def reject_ride(
    booking_id: str,
    current_user: dict = Depends(get_driver_user)
):
    # For now, we just return success
    # In a full implementation, this could track rejected requests
    return {
        "success": True,
        "message": "Ride request rejected"
    }


@router.put("/ride/{ride_id}/status")
async def update_ride_status(
    ride_id: str,
    status: str = Query(..., regex="^(in-progress|completed|cancelled)$"),
    current_user: dict = Depends(get_driver_user)
):
    db = get_database()
    
    driver = get_or_create_driver_profile(current_user["id"], db)
    
    try:
        ride = db.rides.find_one({
            "_id": ObjectId(ride_id),
            "driverId": str(driver["_id"])
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ride ID")
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    now = datetime.utcnow()
    update_data = {"status": status, "updatedAt": now}
    
    if status == "in-progress" and not ride.get("startTime"):
        update_data["startTime"] = now
    elif status == "completed":
        update_data["endTime"] = now
        # Mark driver as available
        db.drivers.update_one(
            {"_id": driver["_id"]},
            {"$set": {"isAvailable": True, "updatedAt": now}, "$inc": {"totalTrips": 1}}
        )
        # Update all passenger bookings
        for passenger in ride.get("passengers", []):
            db.bookings.update_one(
                {"userId": passenger["userId"], "rideId": ride_id},
                {"$set": {"status": "completed", "paymentStatus": "paid", "updatedAt": now}}
            )
    elif status == "cancelled":
        # Mark driver as available
        db.drivers.update_one(
            {"_id": driver["_id"]},
            {"$set": {"isAvailable": True, "updatedAt": now}}
        )
        # Update all passenger bookings
        for passenger in ride.get("passengers", []):
            db.bookings.update_one(
                {"userId": passenger["userId"], "rideId": ride_id},
                {"$set": {"status": "cancelled", "updatedAt": now}}
            )
    
    db.rides.update_one({"_id": ObjectId(ride_id)}, {"$set": update_data})
    
    return {
        "success": True,
        "message": f"Ride status updated to {status}",
        "data": {"rideId": ride_id, "status": status}
    }


@router.get("/rides")
async def get_driver_rides(
    current_user: dict = Depends(get_driver_user),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    db = get_database()
    
    driver = get_or_create_driver_profile(current_user["id"], db)
    
    query = {"driverId": str(driver["_id"])}
    if status:
        query["status"] = status
    
    skip = (page - 1) * limit
    
    rides = list(db.rides.find(query).sort("createdAt", -1).skip(skip).limit(limit))
    total = db.rides.count_documents(query)
    
    for ride in rides:
        ride["id"] = str(ride.pop("_id"))
        if ride.get("createdAt"):
            ride["createdAt"] = ride["createdAt"].isoformat()
        if ride.get("updatedAt"):
            ride["updatedAt"] = ride["updatedAt"].isoformat()
        if ride.get("startTime"):
            ride["startTime"] = ride["startTime"].isoformat()
        if ride.get("endTime"):
            ride["endTime"] = ride["endTime"].isoformat()
    
    return {
        "success": True,
        "data": {
            "rides": rides,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    }
