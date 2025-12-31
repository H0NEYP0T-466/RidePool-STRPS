from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    role: Literal["user", "driver", "admin"] = "user"


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, min_length=10, max_length=15)
    profileImage: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    profileImage: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime


class UserInDB(UserBase):
    id: str
    password: str
    role: str
    profileImage: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
