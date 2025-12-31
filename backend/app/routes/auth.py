from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from app.models.user import UserCreate, UserLogin, UserUpdate
from app.services.auth_service import (
    register_user, login_user, get_user_by_id, update_user
)
from app.utils.jwt_handler import decode_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = get_user_by_id(payload.get("sub"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


@router.post("/register")
async def register(user_data: UserCreate):
    result = register_user(user_data)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return {
        "success": True,
        "message": "User registered successfully",
        "data": result
    }


@router.post("/login")
async def login(login_data: UserLogin):
    result = login_user(login_data)
    
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    
    return {
        "success": True,
        "message": "Login successful",
        "data": result
    }


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "message": "Logout successful"
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "data": current_user
    }
