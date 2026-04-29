from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schema import AlertRequest
from fastapi.responses import JSONResponse
from app.services.alerts_config_service import create_alert_config

# FIX: Removed prefix="/alerts" — main.py already adds it
router = APIRouter(tags=["Alerts"])


@router.post("/config")
async def create_alert(data: AlertRequest, db: Session = Depends(get_db)):
    success, message = create_alert_config(db, data)
    if not success:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "user id does not exist!"}
        )
    return JSONResponse(
        content={"status": "success", "message": "preferences configured successfully!"}
    )
