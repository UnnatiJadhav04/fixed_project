from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schema import UserRegister, UserLogin
from app.services.user_service import register_user, login_user

# FIX: Removed prefix="/user" — main.py adds prefix="/users"
# Keeping it here caused routes to be /users/user/register
router = APIRouter(tags=["Users"])


@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    user, error = register_user(db, data)
    if error:
        # FIX: Return 400 for errors so frontend can catch them properly
        return JSONResponse(status_code=400, content={"message": error})
    return {"message": "Registered successfully!"}


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user, error = login_user(db, data)
    if error:
        # FIX: Return 401 for auth failures so frontend fetch throws an Error
        return JSONResponse(status_code=401, content={"message": error, "user_id": None})
    return {
        "message": "Login successful!",
        "user_id": str(user.id)
    }
