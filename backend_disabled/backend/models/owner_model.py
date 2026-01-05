# backend/models/owner_model.py

from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, UTC
from backend.services.database import Base

class Owner(Base):
    __tablename__ = "owner"

    owner_id = Column(Integer, primary_key=True, index=True)
    owner_name = Column(String, nullable=False)
    contact_phone = Column(String)
    contact_email = Column(String)
    address = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
