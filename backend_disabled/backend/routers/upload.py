from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from backend.services.ocr_service import extract_plate
from backend.models import get_db
from supabase import Client
from datetime import datetime
import tempfile
import os

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...), user_id: str = None, db: Client = Depends(get_db)):
    """Upload image and extract plate number"""
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    # Save file to temp location
    temp_file = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            content = await file.read()
            tmp.write(content)
            temp_file = tmp.name
        
        # Extract plate from image
        plate = extract_plate(temp_file)
        
        # Save to database
        if plate:
            result = db.table("plate_read").insert({
                "user_id": user_id,
                "plate_number": plate,
                "image_reference": file.filename,
                "read_timestamp": datetime.utcnow().isoformat()
            }).execute()
        
        return {
            "filename": file.filename,
            "plate": plate,
            "saved": True if plate else False
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if temp_file and os.path.exists(temp_file):
            os.unlink(temp_file)
