from sqlalchemy.orm import Session
from app.models.models import User, EmailAccount


# -------- API 1 --------
def get_user_email_accounts(db: Session, user_id):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    return user.email_accounts


# -------- API 2 --------
def add_email_accounts(db: Session, user_id, emails):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return False, "user id does not exist!"

    for email in emails:
        new_email = EmailAccount(
            user_id=user_id,
            email_address=email
        )
        db.add(new_email)

    db.commit()

    return True, "inserted successfully!"


# -------- API 3 --------
def update_pass_keys(db: Session, user_id, email_data):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return False, "user id does not exist!"

    for item in email_data:
        record = (
            db.query(EmailAccount)
            .filter(
                EmailAccount.user_id == user_id,
                EmailAccount.email_address == item.email_address
            )
            .first()
        )

        if record:
            record.pass_key = item.pass_key

    db.commit()

    return True, "updated successfully!"