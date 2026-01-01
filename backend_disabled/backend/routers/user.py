from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.services.database import SessionLocal
from backend.schemas.user_schema import UserCreate, UserResponse, UserLogin
from backend.crud.user_crud import create_user, get_user_by_id, get_user_by_email, hash_password
from backend.routers.auth import create_access_token

router = APIRouter(prefix="/users", tags=["Users"])


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db, user_data)
    if user is None:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user


@router.post("/login")
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    # Look up user by email
    user = get_user_by_email(db, credentials.email)
    
    # Verify user exists and password matches
    if not user or hash_password(credentials.password) != user.password_hash:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Create token
    token = create_access_token({"sub": user.email, "user_id": user.user_id})
    
    # Return user info and token
    return {
        "token": token,
        "email": user.email,
        "username": user.username,
        "user_id": user.user_id
    }


@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
