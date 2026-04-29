from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schema import KeywordBulkCreate, KeywordResponse
from app.services.keyword_service import create_keywords_bulk

# FIX: Removed prefix="/keywords" — main.py already adds it
router = APIRouter(tags=["Keywords"])


@router.post("/bulk-add", response_model=KeywordResponse)
def add_keywords(data: KeywordBulkCreate, db: Session = Depends(get_db)):
    success, message = create_keywords_bulk(db, data)
    if not success:
        return JSONResponse(status_code=400, content={"status": "error", "message": message})
    return {"status": "success", "message": message}
