from pymongo import MongoClient
from pymongo.database import Database
from app.config import settings

_client: MongoClient | None = None
_db: Database | None = None


def get_database() -> Database:
    global _client, _db
    if _db is None:
        _client = MongoClient(settings.MONGO_URI)
        _db = _client.get_database()
    return _db


def close_database():
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
