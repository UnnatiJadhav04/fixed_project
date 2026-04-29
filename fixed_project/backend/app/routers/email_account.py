from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.schema import (
    EmailAccountResponse,
    AddEmailsRequest,
    UpdatePassKeyRequest,
    GenericResponse
)
from app.services.email_account_service import (
    get_user_email_accounts,
    add_email_accounts,
    update_pass_keys
)

# FIX: Removed prefix="/email-accounts" — main.py already adds it
router = APIRouter(tags=["Email Accounts"])


@router.get("/{user_id}", response_model=List[EmailAccountResponse])
def get_email_accounts(user_id: str, db: Session = Depends(get_db)):
    records = get_user_email_accounts(db, user_id)
    if not records:
        return []
    return records


@router.post("/add", response_model=GenericResponse)
def add_emails(data: AddEmailsRequest, db: Session = Depends(get_db)):
    success, message = add_email_accounts(db, data.user_id, data.emails)
    if not success:
        return JSONResponse(status_code=400, content={"status": "error", "message": message})
    return {"status": "success", "message": message}


@router.post("/update-passkey", response_model=GenericResponse)
def update_passkey(data: UpdatePassKeyRequest, db: Session = Depends(get_db)):
    success, message = update_pass_keys(db, data.user_id, data.emails)
    if not success:
        return JSONResponse(status_code=400, content={"status": "error", "message": message})
    return {"status": "success", "message": message}
