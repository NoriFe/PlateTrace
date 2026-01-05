from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.services.database import SessionLocal
from backend.schemas.user_schema import UserCreate, UserResponse, UserLogin
from backend.crud.user_crud import create_user, get_user_by_id, get_user_by_email, hash_password
from backend.routers.auth import create_access_token
from datetime import datetime, timedelta

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


@router.get("/{user_id}/plates")
def get_user_plates(user_id: int, date: str = Query(None), db: Session = Depends(get_db)):
    """Get plates detected by user with related vehicle, owner, and location info."""
    from backend.models.plate_model import PlateRead
    from backend.models.vehicle_model import Vehicle
    from backend.models.owner_model import Owner
    from backend.models.location_model import Location

    query = db.query(PlateRead).filter(PlateRead.user_id == user_id)

    if date:
        try:
            requested_date = datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="date must be in YYYY-MM-DD format")

        # Use a range to avoid string matching on timestamps
        start_dt = requested_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_dt = start_dt + timedelta(days=1)
        query = query.filter(PlateRead.read_timestamp >= start_dt, PlateRead.read_timestamp < end_dt)

    plate_reads = query.all()
    plates = []

    for plate in plate_reads:
        plate_info = {
            "read_id": plate.read_id,
            "plate_number": plate.plate_number,
            "timestamp": plate.read_timestamp,
            "image_reference": plate.image_reference,
        }

        vehicle = db.query(Vehicle).filter(Vehicle.vehicle_id == plate.vehicle_id).first()
        if vehicle:
            plate_info["vehicle"] = {
                "id": vehicle.vehicle_id,
                "plate_number": vehicle.plate_number,
                "make": vehicle.make,
                "model": vehicle.model,
                "year": vehicle.year,
                "color": vehicle.color,
            }

            owner = db.query(Owner).filter(Owner.owner_id == vehicle.owner_id).first()
            if owner:
                plate_info["owner"] = {
                    "id": owner.owner_id,
                    "name": owner.owner_name,
                    "contact_phone": owner.contact_phone,
                    "contact_email": owner.contact_email,
                    "address": owner.address,
                }

        if plate.location_id:
            location = db.query(Location).filter(Location.location_id == plate.location_id).first()
            if location:
                plate_info["location"] = {
                    "id": location.location_id,
                    "name": location.location_name,
                    "address": location.address,
                }

        plates.append(plate_info)

    return {"count": len(plates), "plates": plates}


@router.delete("/{user_id}/plates/{read_id}")
def delete_plate_read(user_id: int, read_id: int, db: Session = Depends(get_db)):
    """Delete a plate read belonging to the given user."""
    from backend.models.plate_model import PlateRead

    plate_read = (
        db.query(PlateRead)
        .filter(PlateRead.read_id == read_id, PlateRead.user_id == user_id)
        .first()
    )

    if not plate_read:
        raise HTTPException(status_code=404, detail="Plate read not found for this user")

    db.delete(plate_read)
    db.commit()
    return {"deleted": True, "read_id": read_id}


@router.get("/{user_id}/vehicles")
def get_user_vehicles(user_id: int, db: Session = Depends(get_db)):
    """Get vehicles registered by user"""
    from backend.models.vehicle_model import Vehicle

    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == user_id).all()
    return {
        "count": len(vehicles),
        "vehicles": [
            {
                "id": v.vehicle_id,
                "plate_number": v.plate_number,
                "make": v.make,
                "model": v.model,
                "year": v.year,
                "color": v.color,
            }
            for v in vehicles
        ],
    }
