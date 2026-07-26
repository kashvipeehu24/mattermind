from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.database import Base, engine
from backend.app.core.logging import setup_logging
import backend.app.models  # Ensure all SQLAlchemy models are registered

from backend.app.api.material import router as material_router
from backend.app.api.auth import router as auth_router
from backend.app.api.user import router as user_router
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.analytics import router as analytics_router
from backend.app.api.reports import router as reports_router

setup_logging()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MatterMind API",
    version="1.0.0",
    description="AI-Powered Material Intelligence Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(material_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {"project": "MatterMind", "status": "Backend Running 🚀"}


@app.get("/health")
def health():
    return {"status": "healthy"}