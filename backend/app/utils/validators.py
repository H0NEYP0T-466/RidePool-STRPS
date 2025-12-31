import re
from typing import Any


def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone: str) -> bool:
    pattern = r'^\+?[0-9]{10,15}$'
    return re.match(pattern, phone) is not None


def validate_password(password: str) -> bool:
    return len(password) >= 6


def sanitize_string(value: str) -> str:
    return value.strip()


def validate_location(location: dict[str, Any]) -> bool:
    if not isinstance(location, dict):
        return False
    lat = location.get("lat")
    lng = location.get("lng")
    if lat is None or lng is None:
        return False
    try:
        lat = float(lat)
        lng = float(lng)
        return -90 <= lat <= 90 and -180 <= lng <= 180
    except (ValueError, TypeError):
        return False
