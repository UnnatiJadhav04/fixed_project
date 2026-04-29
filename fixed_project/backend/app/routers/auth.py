from fastapi import APIRouter

from app.schemas.schema import SendOTP, VerifyOTP
from app.utils.otp import generate_otp
from app.utils.email import send_otp_email
from app.services.otp_service import store_otp, verify_otp

# FIX: Removed prefix="/auth" here — main.py already adds prefix="/auth"
# Having it in both places caused routes to become /auth/auth/send-otp
router = APIRouter(tags=["Auth"])


@router.post("/send-otp")
def send_otp(data: SendOTP):
    otp = generate_otp()
    store_otp(data.email, otp)
    send_otp_email(data.email, otp)
    return {"message": "OTP sent successfully"}


@router.post("/verify-otp")
def verify(data: VerifyOTP):
    if verify_otp(data.email, data.otp):
        return {"message": "OTP verified successfully"}

    return {"message": "Invalid or expired OTP"}
