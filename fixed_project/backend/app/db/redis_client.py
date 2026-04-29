import redis
from app.core.config import settings

# FIX: Previously .env had "redis = Redis(host=...)" as a literal string
# which is not a valid env var. Now .env has REDIS_HOST and REDIS_PORT
# as proper key=value pairs, so settings.REDIS_HOST works correctly.
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True
)
