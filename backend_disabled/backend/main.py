from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.upload import router as upload_router
from backend.routers.user import router as user_router   # <-- UPDATED HERE

from backend.services.database import Base, engine
from backend.models import plate_model, user_model, owner_model, vehicle_model, location_model  # noqa: F401


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "PlateTrace backend is running"}

# Routers
app.include_router(upload_router)
app.include_router(user_router)   # <-- UPDATED HERE
