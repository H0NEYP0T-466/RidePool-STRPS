from typing import List
import math


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate the distance between two points in kilometers."""
    R = 6371
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = math.sin(delta_lat / 2) ** 2 + \
        math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


def optimize_route(pickup_points: List[dict], dropoff_points: List[dict]) -> List[dict]:
    """
    Optimize route for multiple pickup and dropoff points.
    Uses a simple nearest neighbor heuristic.
    Returns ordered list of waypoints.
    """
    if not pickup_points:
        return []
    
    waypoints = []
    all_points = []
    
    # Add all pickup points first (they must come before their corresponding dropoffs)
    for i, p in enumerate(pickup_points):
        all_points.append({
            "type": "pickup",
            "index": i,
            "lat": p["lat"],
            "lng": p["lng"],
            "address": p.get("address", ""),
            "visited": False
        })
    
    # Add dropoff points
    for i, d in enumerate(dropoff_points):
        all_points.append({
            "type": "dropoff",
            "index": i,
            "lat": d["lat"],
            "lng": d["lng"],
            "address": d.get("address", ""),
            "visited": False,
            "pickup_done": False
        })
    
    # Start from first pickup point
    current = all_points[0]
    current["visited"] = True
    waypoints.append({
        "type": current["type"],
        "lat": current["lat"],
        "lng": current["lng"],
        "address": current["address"]
    })
    
    # Mark first pickup as done for corresponding dropoff
    for p in all_points:
        if p["type"] == "dropoff" and p["index"] == 0:
            p["pickup_done"] = True
    
    # Nearest neighbor algorithm
    while True:
        unvisited = [p for p in all_points if not p["visited"]]
        
        # Filter out dropoffs whose pickups haven't been done yet
        available = [
            p for p in unvisited 
            if p["type"] == "pickup" or (p["type"] == "dropoff" and p.get("pickup_done", False))
        ]
        
        if not available:
            break
        
        # Find nearest available point
        nearest = min(
            available,
            key=lambda p: haversine_distance(
                current["lat"], current["lng"],
                p["lat"], p["lng"]
            )
        )
        
        nearest["visited"] = True
        waypoints.append({
            "type": nearest["type"],
            "lat": nearest["lat"],
            "lng": nearest["lng"],
            "address": nearest["address"]
        })
        
        # If this was a pickup, mark corresponding dropoff as available
        if nearest["type"] == "pickup":
            for p in all_points:
                if p["type"] == "dropoff" and p["index"] == nearest["index"]:
                    p["pickup_done"] = True
        
        current = nearest
    
    return waypoints


def calculate_total_distance(waypoints: List[dict]) -> float:
    """Calculate total distance of a route in kilometers."""
    if len(waypoints) < 2:
        return 0.0
    
    total = 0.0
    for i in range(len(waypoints) - 1):
        total += haversine_distance(
            waypoints[i]["lat"], waypoints[i]["lng"],
            waypoints[i + 1]["lat"], waypoints[i + 1]["lng"]
        )
    
    return round(total, 2)


def estimate_duration(distance_km: float, avg_speed_kmh: float = 40.0) -> int:
    """Estimate trip duration in minutes."""
    hours = distance_km / avg_speed_kmh
    return int(hours * 60)
