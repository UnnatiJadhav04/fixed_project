from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging

from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine
from app.models.models import Base
from app.routers import user, auth, email_account, keyword, alerts_config


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Inbox Guardian API...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully!")
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")
    yield
    logger.info("🛑 Shutting down Inbox Guardian API...")


app = FastAPI(
    title="Inbox Guardian API",
    description="Secure Email Intelligence & Monitoring System",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Inbox Guardian API is running 🚀",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Inbox Guardian API"
    }


# FIX: Routers no longer carry their own prefix (removed from router files).
# All route prefixes are defined here in ONE place to avoid doubling.
# Correct final routes:
#   POST /auth/send-otp
#   POST /auth/verify-otp
#   POST /users/register
#   POST /users/login
#   GET  /email-accounts/{user_id}
#   POST /email-accounts/add
#   POST /email-accounts/update-passkey
#   POST /keywords/bulk-add
#   POST /alerts/config
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(email_account.router, prefix="/email-accounts", tags=["Email Accounts"])
app.include_router(keyword.router, prefix="/keywords", tags=["Keywords"])
app.include_router(alerts_config.router, prefix="/alerts", tags=["Alerts"])
