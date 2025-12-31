import bcrypt
from datetime import datetime
from bson import ObjectId
from app.utils.database import get_database
from app.utils.jwt_handler import create_access_token
from app.models.user import UserCreate, UserLogin


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def register_user(user_data: UserCreate) -> dict:
    db = get_database()
    
    existing_user = db.users.find_one({"email": user_data.email})
    if existing_user:
        return {"error": "Email already registered"}
    
    now = datetime.utcnow()
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "phone": user_data.phone,
        "password": hash_password(user_data.password),
        "role": user_data.role,
        "profileImage": None,
        "createdAt": now,
        "updatedAt": now
    }
    
    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    token = create_access_token({
        "sub": str(user_doc["_id"]),
        "email": user_doc["email"],
        "role": user_doc["role"]
    })
    
    return {
        "user": format_user_response(user_doc),
        "token": token
    }


def login_user(login_data: UserLogin) -> dict:
    db = get_database()
    
    user = db.users.find_one({"email": login_data.email})
    if not user:
        return {"error": "Invalid email or password"}
    
    if not verify_password(login_data.password, user["password"]):
        return {"error": "Invalid email or password"}
    
    token = create_access_token({
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    })
    
    return {
        "user": format_user_response(user),
        "token": token
    }


def get_user_by_id(user_id: str) -> dict | None:
    db = get_database()
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            return format_user_response(user)
        return None
    except Exception:
        return None


def update_user(user_id: str, update_data: dict) -> dict | None:
    db = get_database()
    try:
        update_data["updatedAt"] = datetime.utcnow()
        result = db.users.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_data},
            return_document=True
        )
        if result:
            return format_user_response(result)
        return None
    except Exception:
        return None


def format_user_response(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "role": user["role"],
        "profileImage": user.get("profileImage"),
        "createdAt": user["createdAt"].isoformat() if user.get("createdAt") else None,
        "updatedAt": user["updatedAt"].isoformat() if user.get("updatedAt") else None
    }
