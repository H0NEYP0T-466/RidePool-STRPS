import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.utils.database import get_database, close_database
from app.routes import auth, user, driver, ride, admin
from app.websocket.socket_handler import sio


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    get_database()
    print("Connected to MongoDB")
    yield
    # Shutdown
    close_database()
    print("Disconnected from MongoDB")


app = FastAPI(
    title="RidePool STRPS API",
    description="Smart Transportation & Ride-Pooling System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(driver.router)
app.include_router(ride.router)
app.include_router(admin.router)


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "RidePool STRPS API is running"}


@app.get("/")
async def root():
    return {
        "message": "Welcome to RidePool STRPS API",
        "version": "1.0.0",
        "docs": "/docs"
    }


# Create ASGI app with Socket.IO
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:socket_app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )
