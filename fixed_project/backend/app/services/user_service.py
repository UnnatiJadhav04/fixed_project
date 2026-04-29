from sqlalchemy.orm import Session

from app.models.models import User
from app.core.security import hash_password, verify_password
from app.services.otp_service import is_verified


def register_user(db: Session, data):
    # OTP verification check (IMPORTANT NEW STEP)
    if not is_verified(data.email):
        return None, "Email not verified via OTP"

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email).first()

    if existing_user:
        return None, "User already exists"

    # Create new user
    new_user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        mobile_number=data.mobile_number
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user, None


def login_user(db: Session, data):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        return None, "Invalid email or password"

    if not verify_password(data.password, user.password_hash):
        return None, "Invalid email or password"

    return user, None