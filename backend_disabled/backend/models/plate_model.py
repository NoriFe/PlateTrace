from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, UTC
from backend.services.database import Base

class PlateRead(Base):
    __tablename__ = "plate_read"

    read_id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String, index=True)
    read_timestamp = Column(DateTime, default=lambda: datetime.now(UTC))
    image_reference = Column(String)

    user_id = Column(Integer, ForeignKey("user.user_id"))
    vehicle_id = Column(Integer, ForeignKey("vehicle.vehicle_id"))
    location_id = Column(Integer, ForeignKey("location.location_id"))
