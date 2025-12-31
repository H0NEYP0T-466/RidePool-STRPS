from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional
from app.routes.auth import get_current_user
from app.utils.database import get_database
from app.services.payment_service import get_payment_summary
from app.models.feedback import FeedbackCreate

router = APIRouter(prefix="/api/admin", tags=["Admin"])


def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Admin role required.")
    return current_user


@router.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_admin_user)):
    db = get_database()
    
    # Get counts
    total_users = db.users.count_documents({"role": "user"})
    total_drivers = db.drivers.count_documents({})
    total_rides = db.rides.count_documents({})
    active_rides = db.rides.count_documents({"status": {"$in": ["requested", "accepted", "in-progress"]}})
    completed_rides = db.rides.count_documents({"status": "completed"})
    
    # Get revenue
    completed = list(db.rides.find({"status": "completed"}))
    total_revenue = sum(ride.get("totalFare", 0) for ride in completed)
    
    # Get recent activity
    recent_rides = list(db.rides.find().sort("createdAt", -1).limit(5))
    for ride in recent_rides:
        ride["id"] = str(ride.pop("_id"))
        if ride.get("createdAt"):
            ride["createdAt"] = ride["createdAt"].isoformat()
    
    # Get average rating
    feedbacks = list(db.feedback.find())
    avg_rating = sum(f.get("rating", 0) for f in feedbacks) / len(feedbacks) if feedbacks else 0
    
    return {
        "success": True,
        "data": {
            "metrics": {
                "totalUsers": total_users,
                "totalDrivers": total_drivers,
                "totalRides": total_rides,
                "activeRides": active_rides,
                "completedRides": completed_rides,
                "totalRevenue": round(total_revenue, 2),
                "averageRating": round(avg_rating, 2)
            },
            "recentRides": recent_rides
        }
    }


@router.get("/trips")
async def get_all_trips(
    current_user: dict = Depends(get_admin_user),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    db = get_database()
    
    query = {}
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
        
        # Get driver info
        if ride.get("driverId"):
            driver = db.drivers.find_one({"_id": ObjectId(ride["driverId"])})
            if driver:
                user = db.users.find_one({"_id": ObjectId(driver["userId"])})
                ride["driverName"] = user["name"] if user else "Unknown"
    
    return {
        "success": True,
        "data": {
            "trips": rides,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    }


@router.get("/users")
async def get_all_users(
    current_user: dict = Depends(get_admin_user),
    role: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    db = get_database()
    
    query = {}
    if role:
        query["role"] = role
    
    skip = (page - 1) * limit
    
    users = list(db.users.find(query).sort("createdAt", -1).skip(skip).limit(limit))
    total = db.users.count_documents(query)
    
    for user in users:
        user["id"] = str(user.pop("_id"))
        user.pop("password", None)  # Remove password from response
        if user.get("createdAt"):
            user["createdAt"] = user["createdAt"].isoformat()
        if user.get("updatedAt"):
            user["updatedAt"] = user["updatedAt"].isoformat()
    
    return {
        "success": True,
        "data": {
            "users": users,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    }


@router.get("/drivers")
async def get_all_drivers(
    current_user: dict = Depends(get_admin_user),
    available: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    db = get_database()
    
    query = {}
    if available is not None:
        query["isAvailable"] = available
    
    skip = (page - 1) * limit
    
    drivers = list(db.drivers.find(query).sort("createdAt", -1).skip(skip).limit(limit))
    total = db.drivers.count_documents(query)
    
    for driver in drivers:
        driver["id"] = str(driver.pop("_id"))
        if driver.get("createdAt"):
            driver["createdAt"] = driver["createdAt"].isoformat()
        if driver.get("updatedAt"):
            driver["updatedAt"] = driver["updatedAt"].isoformat()
        
        # Get user info
        user = db.users.find_one({"_id": ObjectId(driver["userId"])})
        if user:
            driver["userName"] = user["name"]
            driver["userEmail"] = user["email"]
            driver["userPhone"] = user["phone"]
    
    return {
        "success": True,
        "data": {
            "drivers": drivers,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    }


@router.get("/payments")
async def get_payment_reports(
    current_user: dict = Depends(get_admin_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    db = get_database()
    
    skip = (page - 1) * limit
    
    # Get all rides for summary
    all_rides = list(db.rides.find())
    summary = get_payment_summary(all_rides)
    
    # Get paginated completed rides with payment info
    completed_rides = list(
        db.rides.find({"status": "completed"})
        .sort("endTime", -1)
        .skip(skip)
        .limit(limit)
    )
    total = db.rides.count_documents({"status": "completed"})
    
    payments = []
    for ride in completed_rides:
        payment = {
            "rideId": str(ride["_id"]),
            "totalFare": ride.get("totalFare", 0),
            "isPooled": ride.get("isPooled", False),
            "passengerCount": len(ride.get("passengers", [])),
            "completedAt": ride["endTime"].isoformat() if ride.get("endTime") else None
        }
        
        # Get driver info
        if ride.get("driverId"):
            driver = db.drivers.find_one({"_id": ObjectId(ride["driverId"])})
            if driver:
                user = db.users.find_one({"_id": ObjectId(driver["userId"])})
                payment["driverName"] = user["name"] if user else "Unknown"
        
        payments.append(payment)
    
    return {
        "success": True,
        "data": {
            "summary": summary,
            "payments": payments,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    }


@router.get("/feedback")
async def get_all_feedback(
    current_user: dict = Depends(get_admin_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    db = get_database()
    
    skip = (page - 1) * limit
    
    feedbacks = list(db.feedback.find().sort("createdAt", -1).skip(skip).limit(limit))
    total = db.feedback.count_documents({})
    
    for feedback in feedbacks:
        feedback["id"] = str(feedback.pop("_id"))
        if feedback.get("createdAt"):
            feedback["createdAt"] = feedback["createdAt"].isoformat()
        
        # Get user info
        user = db.users.find_one({"_id": ObjectId(feedback["userId"])})
        feedback["userName"] = user["name"] if user else "Unknown"
        
        # Get driver info
        driver = db.drivers.find_one({"_id": ObjectId(feedback["driverId"])})
        if driver:
            driver_user = db.users.find_one({"_id": ObjectId(driver["userId"])})
            feedback["driverName"] = driver_user["name"] if driver_user else "Unknown"
    
    # Calculate average rating
    all_feedbacks = list(db.feedback.find())
    avg_rating = sum(f.get("rating", 0) for f in all_feedbacks) / len(all_feedbacks) if all_feedbacks else 0
    
    return {
        "success": True,
        "data": {
            "feedback": feedbacks,
            "averageRating": round(avg_rating, 2),
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    }


@router.put("/user/{user_id}")
async def update_user_status(
    user_id: str,
    current_user: dict = Depends(get_admin_user)
):
    # Placeholder for user status update
    return {
        "success": True,
        "message": "User updated successfully"
    }


@router.put("/driver/{driver_id}")
async def update_driver_status(
    driver_id: str,
    is_available: Optional[bool] = Query(None),
    current_user: dict = Depends(get_admin_user)
):
    db = get_database()
    
    try:
        driver = db.drivers.find_one({"_id": ObjectId(driver_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid driver ID")
    
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    update_data = {"updatedAt": datetime.utcnow()}
    if is_available is not None:
        update_data["isAvailable"] = is_available
    
    db.drivers.update_one({"_id": ObjectId(driver_id)}, {"$set": update_data})
    
    return {
        "success": True,
        "message": "Driver updated successfully"
    }


@router.post("/feedback")
async def create_feedback(
    feedback_data: FeedbackCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create feedback for a completed ride."""
    db = get_database()
    
    now = datetime.utcnow()
    feedback_doc = {
        "userId": current_user["id"],
        "rideId": feedback_data.rideId,
        "driverId": feedback_data.driverId,
        "rating": feedback_data.rating,
        "comment": feedback_data.comment,
        "createdAt": now
    }
    
    result = db.feedback.insert_one(feedback_doc)
    
    # Update driver's average rating
    driver_feedbacks = list(db.feedback.find({"driverId": feedback_data.driverId}))
    avg_rating = sum(f["rating"] for f in driver_feedbacks) / len(driver_feedbacks)
    
    db.drivers.update_one(
        {"_id": ObjectId(feedback_data.driverId)},
        {"$set": {"rating": round(avg_rating, 2)}}
    )
    
    return {
        "success": True,
        "message": "Feedback submitted successfully",
        "data": {
            "feedbackId": str(result.inserted_id)
        }
    }
