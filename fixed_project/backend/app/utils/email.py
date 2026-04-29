import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


def send_otp_email(to_email: str, otp: str):
    msg = MIMEMultipart()
    msg["From"] = settings.SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = "Your OTP for Registration - InboxGuardian"

    body = f"""
Hello,

Your OTP is: {otp}

This OTP is valid for 10 minutes.

Regards,
InboxGuardian
"""

    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg)
    finally:
        server.quit()