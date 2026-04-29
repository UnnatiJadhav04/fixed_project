from uuid import UUID
from enum import Enum
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    mobile_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class MessageResponse(BaseModel):
    message: str

class SendOTP(BaseModel):
    email: EmailStr

class VerifyOTP(BaseModel):
    email: EmailStr
    otp: str


class EmailAccountResponse(BaseModel):
    email_address: EmailStr
    pass_key: Optional[str] = None
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True


class AddEmailsRequest(BaseModel):
    user_id: UUID
    emails: List[EmailStr]


class GenericResponse(BaseModel):
    status: str
    message: str


class EmailPassKeyItem(BaseModel):
    email_address: EmailStr
    pass_key: str


class UpdatePassKeyRequest(BaseModel):
    user_id: UUID
    emails: List[EmailPassKeyItem]

# -------- CATEGORY ITEM --------
class KeywordCategoryItem(BaseModel):
    type: Literal["subject", "sender", "body"]
    subject_keyword: List[str]


# -------- INPUT SCHEMA --------
class KeywordBulkCreate(BaseModel):
    user_id: UUID
    category: List[KeywordCategoryItem]


# -------- RESPONSE SCHEMA --------
class KeywordResponse(BaseModel):
    status: str
    message: str


class UrgencyLevel(str, Enum):
    low = 'low'
    medium = 'medium'
    high = 'high'

class AlertConfig(BaseModel):
    email_alert: Optional[bool] = Field(default=True)
    push_notification: Optional[bool] = Field(default=False)
    whatsapp_alert: Optional[bool] = Field(default=False)
    sms_alert: Optional[bool] = Field(default=False)
    urgency_level: Optional[UrgencyLevel]

class AlertRequest(BaseModel):
    user_id: UUID
    alert_config: List[AlertConfig]