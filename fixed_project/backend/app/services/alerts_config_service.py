from sqlalchemy.orm import Session
from app.models.models import User, Keyword


def create_alert_config(db: Session, data):
    # Validate user
    user = db.query(User).filter(User.id == data.user_id).first()

    if not user:
        return False, "user id does not exist!"

    return True, "Data inserted successfully!"