from sqlalchemy.orm import Session
from backend.models.user_model import User
from backend.schemas.user_schema import UserCreate
from datetime import datetime, UTC
import hashlib


def hash_password(password: str) -> str:
    # Simple SHA256 hash (replace with bcrypt later)
    return hashlib.sha256(password.encode()).hexdigest()


def create_user(db: Session, user_data: UserCreate):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()  # type: ignore
    if existing_user:
        return None  # or raise an exception later

    hashed_pw = hash_password(user_data.password)

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_pw,
        created_at=datetime.now(UTC)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()  # type: ignore


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()  # type: ignore