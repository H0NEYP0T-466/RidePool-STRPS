from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


class LocationWithAddress(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    address: str = ""


class Passenger(BaseModel):
    userId: str
    pickupLocation: LocationWithAddress
    dropoffLocation: LocationWithAddress
    status: Literal["pending", "picked", "dropped"] = "pending"
    fare: float = 0.0


class RideCreate(BaseModel):
    driverId: Optional[str] = None
    passengers: List[Passenger] = []
    isPooled: bool = False
    status: Literal["requested", "accepted", "in-progress", "completed", "cancelled"] = "requested"


class RideStatusUpdate(BaseModel):
    status: Literal["requested", "accepted", "in-progress", "completed", "cancelled"]


class PassengerStatusUpdate(BaseModel):
    passengerId: str
    status: Literal["pending", "picked", "dropped"]


class RideResponse(BaseModel):
    id: str
    driverId: Optional[str] = None
    passengers: List[Passenger] = []
    isPooled: bool
    status: str
    route: List[dict] = []
    totalFare: float = 0.0
    startTime: Optional[datetime] = None
    endTime: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime


class RideInDB(BaseModel):
    id: str
    driverId: Optional[str] = None
    passengers: List[dict] = []
    isPooled: bool
    status: str
    route: List[dict] = []
    totalFare: float = 0.0
    startTime: Optional[datetime] = None
    endTime: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime
