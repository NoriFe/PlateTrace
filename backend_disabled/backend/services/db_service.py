from backend.models.plate_model import PlateRead
from backend.services.database import SessionLocal

def save_plate_read(plate_number, image_reference, user_id, vehicle_id, location_id):
    db = SessionLocal()
    read = PlateRead(
        plate_number=plate_number,
        image_reference=image_reference,
        user_id=user_id,
        vehicle_id=vehicle_id,
        location_id=location_id
    )
    db.add(read)
    db.commit()
    db.refresh(read)
    db.close()
    return read
