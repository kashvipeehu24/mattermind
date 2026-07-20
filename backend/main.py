from fastapi import FastAPI
from backend.app.core.database import Base, engine
from backend.app.models import Material
from backend.app.api.material import router as material_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MatterMind API",
    version="1.0.0",
    description="AI-Powered Material Intelligence Platform"
)
app.include_router(material_router)


@app.get("/")
def root():
    return {
        "project": "MatterMind",
        "status": "Backend Running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }