from fastapi import APIRouter, UploadFile, File
from backend.services.ocr_service import extract_plate

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # For now, just call the placeholder OCR function
    plate = extract_plate("dummy_path")

    return {
        "filename": file.filename,
        "plate": plate
    }
