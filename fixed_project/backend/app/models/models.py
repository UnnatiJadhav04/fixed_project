import uuid
from datetime import datetime

from sqlalchemy import (
    Column,
    String,
    Boolean,
    Integer,
    ForeignKey,
    Text,
    TIMESTAMP,
    CheckConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base


Base = declarative_base()


# -------------------------
# USERS TABLE
# -------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    mobile_number = Column(String(15), nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # Relationships
    email_accounts = relationship("EmailAccount", back_populates="user", cascade="all, delete-orphan")
    keywords = relationship("Keyword", back_populates="user", cascade="all, delete-orphan")


# -------------------------
# EMAIL ACCOUNTS TABLE
# -------------------------
class EmailAccount(Base):
    __tablename__ = "email_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))

    email_address = Column(String(255), nullable=False)

    pass_key = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="email_accounts")



# -------------------------
# KEYWORDS TABLE
# -------------------------
class Keyword(Base):
    __tablename__ = "keywords"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))

    subject_keyword = Column(String(100), nullable=False)

    type = Column(String(20), nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # Constraint: only allow specific values
    __table_args__ = (
        CheckConstraint(
            "type IN ('subject', 'sender', 'body')",
            name="check_keyword_type"
        ),
    )

    # Relationships
    user = relationship("User", back_populates="keywords")
