from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FeedbackCreate(BaseModel):
    rideId: str
    driverId: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=500)


class FeedbackResponse(BaseModel):
    id: str
    userId: str
    rideId: str
    driverId: str
    rating: int
    comment: Optional[str] = None
    createdAt: datetime


class FeedbackInDB(BaseModel):
    id: str
    userId: str
    rideId: str
    driverId: str
    rating: int
    comment: Optional[str] = None
    createdAt: datetime
