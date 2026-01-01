from pydantic import BaseModel, EmailStr
from datetime import datetime

# What the client sends when creating a user
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str  # plain password, will be hashed later


# What the client sends when logging in (optional)
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# What the API returns back to the client
class UserResponse(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
