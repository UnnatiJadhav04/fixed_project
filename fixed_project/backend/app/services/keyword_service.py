from sqlalchemy.orm import Session
from app.models.models import User, Keyword


def create_keywords_bulk(db: Session, data):
    # Validate user
    user = db.query(User).filter(User.id == data.user_id).first()

    if not user:
        return False, "user id does not exist!"

    records_to_insert = []

    for category in data.category:
        keyword_type = category.type

        for keyword in category.subject_keyword:
            if len(keyword) > 100:
                return False, f"Keyword '{keyword}' exceeds 100 characters"

            records_to_insert.append(
                Keyword(
                    user_id=data.user_id,
                    subject_keyword=keyword,
                    type=keyword_type
                )
            )

    # Bulk insert
    db.add_all(records_to_insert)
    db.commit()

    return True, "Data inserted successfully!"