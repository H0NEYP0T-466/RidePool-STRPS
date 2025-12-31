import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/strps")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production")
    JWT_EXPIRY: int = int(os.getenv("JWT_EXPIRY", "3600"))
    PORT: int = int(os.getenv("PORT", "8888"))
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")


settings = Settings()
