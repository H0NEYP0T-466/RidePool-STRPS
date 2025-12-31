from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Location(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class DriverCreate(BaseModel):
    userId: str
    vehicleType: str = Field(..., min_length=1, max_length=50)
    vehicleNumber: str = Field(..., min_length=1, max_length=20)
    licenseNumber: str = Field(..., min_length=1, max_length=30)
    currentLocation: Optional[Location] = None
    isAvailable: bool = True


class DriverUpdate(BaseModel):
    vehicleType: Optional[str] = Field(None, min_length=1, max_length=50)
    vehicleNumber: Optional[str] = Field(None, min_length=1, max_length=20)
    licenseNumber: Optional[str] = Field(None, min_length=1, max_length=30)
    isAvailable: Optional[bool] = None


class DriverLocationUpdate(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class DriverResponse(BaseModel):
    id: str
    userId: str
    vehicleType: str
    vehicleNumber: str
    licenseNumber: str
    currentLocation: Optional[Location] = None
    isAvailable: bool
    rating: float = 0.0
    totalTrips: int = 0
    createdAt: datetime
    updatedAt: datetime


class DriverInDB(BaseModel):
    id: str
    userId: str
    vehicleType: str
    vehicleNumber: str
    licenseNumber: str
    currentLocation: Optional[dict] = None
    isAvailable: bool
    rating: float = 0.0
    totalTrips: int = 0
    createdAt: datetime
    updatedAt: datetime
