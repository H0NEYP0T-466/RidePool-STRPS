import socketio
from datetime import datetime
from typing import Dict, Set

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)

# Track connected clients
user_rooms: Dict[str, str] = {}  # user_id -> session_id
driver_rooms: Dict[str, str] = {}  # driver_id -> session_id
active_rides: Set[str] = set()  # ride_ids with active tracking


@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    # Clean up user/driver rooms
    user_to_remove = None
    for user_id, session_id in user_rooms.items():
        if session_id == sid:
            user_to_remove = user_id
            break
    if user_to_remove:
        del user_rooms[user_to_remove]
    
    driver_to_remove = None
    for driver_id, session_id in driver_rooms.items():
        if session_id == sid:
            driver_to_remove = driver_id
            break
    if driver_to_remove:
        del driver_rooms[driver_to_remove]


@sio.event
async def join_room(sid, data):
    """User or driver joins their personal room for updates."""
    user_id = data.get("userId")
    user_type = data.get("type", "user")  # "user" or "driver"
    
    if user_id:
        room_name = f"{user_type}_{user_id}"
        await sio.enter_room(sid, room_name)
        
        if user_type == "driver":
            driver_rooms[user_id] = sid
        else:
            user_rooms[user_id] = sid
        
        print(f"{user_type} {user_id} joined room {room_name}")
        await sio.emit("room_joined", {"room": room_name}, room=sid)


@sio.event
async def leave_room(sid, data):
    """User or driver leaves their room."""
    user_id = data.get("userId")
    user_type = data.get("type", "user")
    
    if user_id:
        room_name = f"{user_type}_{user_id}"
        await sio.leave_room(sid, room_name)
        print(f"{user_type} {user_id} left room {room_name}")


@sio.event
async def location_update(sid, data):
    """Driver sends location updates."""
    driver_id = data.get("driverId")
    lat = data.get("lat")
    lng = data.get("lng")
    ride_id = data.get("rideId")
    
    if driver_id and lat is not None and lng is not None:
        location_data = {
            "driverId": driver_id,
            "lat": lat,
            "lng": lng,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Broadcast to ride room if ride is active
        if ride_id:
            await sio.emit("driver_location", location_data, room=f"ride_{ride_id}")
        
        print(f"Driver {driver_id} location updated: {lat}, {lng}")


@sio.event
async def join_ride_room(sid, data):
    """Join a ride-specific room for tracking."""
    ride_id = data.get("rideId")
    if ride_id:
        room_name = f"ride_{ride_id}"
        await sio.enter_room(sid, room_name)
        active_rides.add(ride_id)
        print(f"Client joined ride room {room_name}")


@sio.event
async def leave_ride_room(sid, data):
    """Leave a ride-specific room."""
    ride_id = data.get("rideId")
    if ride_id:
        room_name = f"ride_{ride_id}"
        await sio.leave_room(sid, room_name)
        print(f"Client left ride room {room_name}")


@sio.event
async def ride_status_update(sid, data):
    """Driver updates ride status."""
    ride_id = data.get("rideId")
    status = data.get("status")
    
    if ride_id and status:
        status_data = {
            "rideId": ride_id,
            "status": status,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Broadcast to all clients in the ride room
        await sio.emit("ride_status_changed", status_data, room=f"ride_{ride_id}")
        print(f"Ride {ride_id} status updated to {status}")


# Helper functions to emit events from routes
async def emit_new_ride_request(driver_id: str, ride_data: dict):
    """Emit new ride request to a specific driver."""
    await sio.emit("new_ride_request", ride_data, room=f"driver_{driver_id}")


async def emit_ride_accepted(user_id: str, ride_data: dict):
    """Emit ride accepted notification to user."""
    await sio.emit("ride_accepted", ride_data, room=f"user_{user_id}")


async def emit_ride_started(user_id: str, ride_data: dict):
    """Emit ride started notification to user."""
    await sio.emit("ride_started", ride_data, room=f"user_{user_id}")


async def emit_ride_completed(user_id: str, ride_data: dict):
    """Emit ride completed notification to user."""
    await sio.emit("ride_completed", ride_data, room=f"user_{user_id}")


async def emit_pool_match_found(user_id: str, match_data: dict):
    """Emit pool match notification to user."""
    await sio.emit("pool_match_found", match_data, room=f"user_{user_id}")


async def emit_driver_location(ride_id: str, location_data: dict):
    """Broadcast driver location to all users in a ride."""
    await sio.emit("driver_location", location_data, room=f"ride_{ride_id}")
