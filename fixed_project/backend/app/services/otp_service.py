from app.db.redis_client import redis_client

OTP_EXPIRY = 600  # 10 minutes


def store_otp(email: str, otp: str):
    redis_client.setex(f"otp:{email}", OTP_EXPIRY, otp)


def verify_otp(email: str, otp: str):
    stored_otp = redis_client.get(f"otp:{email}")

    if not stored_otp:
        return False

    if stored_otp != otp:
        return False

    # mark verified
    redis_client.setex(f"verified:{email}", OTP_EXPIRY, "true")
    redis_client.delete(f"otp:{email}")

    return True


def is_verified(email: str):
    return redis_client.get(f"verified:{email}") == "true"