from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional
from app.routes.auth import get_current_user
from app.utils.database import get_database
from app.models.user import UserUpdate
from app.models.booking import BookingCreate
from app.services.auth_service import update_user
from app.services.payment_service import calculate_fare

router = APIRouter(prefix="/api/user", tags=["User"])


@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "data": current_user
    }


@router.put("/profile")
async def update_profile(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    update_dict = update_data.model_dump(exclude_unset=True)
    if not update_dict:
        raise HTTPException(status_code=400, detail="No data to update")
    
    updated_user = update_user(current_user["id"], update_dict)
    if not updated_user:
        raise HTTPException(status_code=500, detail="Failed to update profile")
    
    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": updated_user
    }


@router.post("/ride/request")
async def request_ride(
    booking_data: BookingCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["user", "admin"]:
        raise HTTPException(status_code=403, detail="Only users can request rides")
    
    db = get_database()
    
    # Calculate fare
    fare_info = calculate_fare(
        booking_data.pickupLocation.lat,
        booking_data.pickupLocation.lng,
        booking_data.dropoffLocation.lat,
        booking_data.dropoffLocation.lng,
        booking_data.wantPooling
    )
    
    now = datetime.utcnow()
    booking_doc = {
        "userId": current_user["id"],
        "rideId": None,
        "pickupLocation": booking_data.pickupLocation.model_dump(),
        "dropoffLocation": booking_data.dropoffLocation.model_dump(),
        "wantPooling": booking_data.wantPooling,
        "status": "requested",
        "fare": fare_info["totalFare"],
        "paymentStatus": "pending",
        "createdAt": now,
        "updatedAt": now
    }
    
    result = db.bookings.insert_one(booking_doc)
    booking_doc["_id"] = result.inserted_id
    
    return {
        "success": True,
        "message": "Ride requested successfully",
        "data": {
            "bookingId": str(booking_doc["_id"]),
            "userId": current_user["id"],
            "pickupLocation": booking_doc["pickupLocation"],
            "dropoffLocation": booking_doc["dropoffLocation"],
            "wantPooling": booking_doc["wantPooling"],
            "status": booking_doc["status"],
            "fareInfo": fare_info,
            "createdAt": now.isoformat()
        }
    }


@router.get("/rides")
async def get_user_rides(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    db = get_database()
    
    query = {"userId": current_user["id"]}
    if status:
        query["status"] = status
    
    skip = (page - 1) * limit
    
    bookings = list(db.bookings.find(query).sort("createdAt", -1).skip(skip).limit(limit))
    total = db.bookings.count_documents(query)
    
    for booking in bookings:
        booking["id"] = str(booking.pop("_id"))
        if booking.get("createdAt"):
            booking["createdAt"] = booking["createdAt"].isoformat()
        if booking.get("updatedAt"):
            booking["updatedAt"] = booking["updatedAt"].isoformat()
    
    return {
        "success": True,
        "data": {
            "rides": bookings,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    }


@router.get("/rides/{ride_id}")
async def get_ride_details(
    ride_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    try:
        booking = db.bookings.find_one({
            "_id": ObjectId(ride_id),
            "userId": current_user["id"]
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ride ID")
    
    if not booking:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    booking["id"] = str(booking.pop("_id"))
    if booking.get("createdAt"):
        booking["createdAt"] = booking["createdAt"].isoformat()
    if booking.get("updatedAt"):
        booking["updatedAt"] = booking["updatedAt"].isoformat()
    
    # Get ride details if matched
    ride_info = None
    if booking.get("rideId"):
        ride = db.rides.find_one({"_id": ObjectId(booking["rideId"])})
        if ride:
            ride_info = {
                "id": str(ride["_id"]),
                "status": ride["status"],
                "isPooled": ride["isPooled"],
                "totalFare": ride.get("totalFare", 0)
            }
            
            # Get driver info
            if ride.get("driverId"):
                driver = db.drivers.find_one({"_id": ObjectId(ride["driverId"])})
                if driver:
                    user = db.users.find_one({"_id": ObjectId(driver["userId"])})
                    ride_info["driver"] = {
                        "name": user["name"] if user else "Unknown",
                        "vehicleType": driver["vehicleType"],
                        "vehicleNumber": driver["vehicleNumber"],
                        "rating": driver.get("rating", 0),
                        "currentLocation": driver.get("currentLocation")
                    }
    
    return {
        "success": True,
        "data": {
            "booking": booking,
            "ride": ride_info
        }
    }
