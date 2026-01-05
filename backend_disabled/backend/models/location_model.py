# backend/models/location_model.py

from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, UTC
from backend.services.database import Base

class Location(Base):
    __tablename__ = "location"

    location_id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String, nullable=False)
    address = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
