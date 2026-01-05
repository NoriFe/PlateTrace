# backend/models/vehicle_model.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, UTC
from backend.services.database import Base

class Vehicle(Base):
    __tablename__ = "vehicle"

    vehicle_id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String, nullable=False, index=True)
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    color = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    owner_id = Column(Integer, ForeignKey("owner.owner_id"))
