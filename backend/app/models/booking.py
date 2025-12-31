from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class LocationWithAddress(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    address: str = ""


class BookingCreate(BaseModel):
    pickupLocation: LocationWithAddress
    dropoffLocation: LocationWithAddress
    wantPooling: bool = False


class BookingResponse(BaseModel):
    id: str
    userId: str
    rideId: Optional[str] = None
    pickupLocation: LocationWithAddress
    dropoffLocation: LocationWithAddress
    wantPooling: bool
    status: str
    fare: float
    paymentStatus: str
    createdAt: datetime
    updatedAt: datetime


class BookingInDB(BaseModel):
    id: str
    userId: str
    rideId: Optional[str] = None
    pickupLocation: dict
    dropoffLocation: dict
    wantPooling: bool
    status: Literal["requested", "matched", "in-progress", "completed", "cancelled"] = "requested"
    fare: float = 0.0
    paymentStatus: Literal["pending", "paid"] = "pending"
    createdAt: datetime
    updatedAt: datetime
