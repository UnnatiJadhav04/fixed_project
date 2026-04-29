import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # DATABASE CONFIG
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")

    DATABASE_URL = (
        f"postgresql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    # REDIS CONFIG
    REDIS_HOST = os.getenv("REDIS_HOST")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    REDIS_DB = int(os.getenv("REDIS_DB", 0))

    # SMTP CONFIG (EMAIL)
    SMTP_USER = os.getenv("inboxguardian.app@gmail.com")
    SMTP_PASS = os.getenv("gcik lngl qlhq wokc")


settings = Settings()