from app.services.route_optimization import haversine_distance

BASE_FARE = 50.0  # Base fare in PKR
PER_KM_RATE = 15.0  # Rate per kilometer in PKR
POOLING_DISCOUNT = 0.25  # 25% discount for pooled rides


def calculate_fare(
    pickup_lat: float,
    pickup_lng: float,
    dropoff_lat: float,
    dropoff_lng: float,
    is_pooled: bool = False
) -> dict:
    """Calculate fare for a ride."""
    distance = haversine_distance(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng)
    
    fare = BASE_FARE + (distance * PER_KM_RATE)
    discount = 0.0
    
    if is_pooled:
        discount = fare * POOLING_DISCOUNT
        fare = fare - discount
    
    return {
        "distance": round(distance, 2),
        "baseFare": BASE_FARE,
        "distanceFare": round(distance * PER_KM_RATE, 2),
        "discount": round(discount, 2),
        "totalFare": round(fare, 2)
    }


def calculate_pool_fare(
    pickup_lat: float,
    pickup_lng: float,
    dropoff_lat: float,
    dropoff_lng: float,
    passenger_count: int
) -> dict:
    """Calculate fare for a pooled ride with dynamic discount based on passengers."""
    distance = haversine_distance(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng)
    
    base_fare = BASE_FARE + (distance * PER_KM_RATE)
    
    # Dynamic discount: 20% for 2 passengers, 25% for 3, 30% for 4
    discount_rate = min(0.30, 0.15 + (passenger_count * 0.05))
    discount = base_fare * discount_rate
    final_fare = base_fare - discount
    
    return {
        "distance": round(distance, 2),
        "baseFare": BASE_FARE,
        "distanceFare": round(distance * PER_KM_RATE, 2),
        "discountRate": round(discount_rate * 100, 0),
        "discount": round(discount, 2),
        "totalFare": round(final_fare, 2)
    }


def get_payment_summary(rides: list) -> dict:
    """Generate payment summary for admin reports."""
    total_revenue = 0.0
    total_rides = len(rides)
    completed_rides = 0
    pooled_rides = 0
    
    for ride in rides:
        if ride.get("status") == "completed":
            completed_rides += 1
            total_revenue += ride.get("totalFare", 0)
        
        if ride.get("isPooled"):
            pooled_rides += 1
    
    return {
        "totalRides": total_rides,
        "completedRides": completed_rides,
        "pooledRides": pooled_rides,
        "totalRevenue": round(total_revenue, 2),
        "averageFare": round(total_revenue / completed_rides, 2) if completed_rides > 0 else 0
    }
