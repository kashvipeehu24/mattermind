from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.core.error_handlers import register_exception_handlers
from backend.app.core.logging import setup_logging

import backend.app.models  # Ensure all SQLAlchemy models are registered

from backend.app.api.material import router as material_router
from backend.app.api.manufacturer import router as manufacturer_router
from backend.app.api.auth import router as auth_router
from backend.app.api.user import router as user_router
from backend.app.api.dashboard import router as dashboard_router
from backend.app.api.analytics import router as analytics_router
from backend.app.api.reports import router as reports_router
from backend.app.api.ai import router as ai_router
from backend.app.api.blockchain import router as blockchain_router


# ============================================================
# INITIALIZATION
# ============================================================

setup_logging()
Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="MatterMind API",
    version="1.0.0",
    description="AI-Powered Material Intelligence Platform",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ERROR HANDLERS
# ============================================================

register_exception_handlers(app)


# ============================================================
# API ROUTES
# ============================================================

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(material_router)
app.include_router(manufacturer_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(reports_router)
app.include_router(ai_router)
app.include_router(blockchain_router)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {"status": "healthy"}


# ============================================================
# REACT FRONTEND
# ============================================================
#
# Render will place the built React/Vite application here.
#
# /app/frontend_dist/
# ├── index.html
# └── assets/
#
# FastAPI will serve the React application from the same
# public URL as the API.
# ============================================================

FRONTEND_DIST = Path("/app/frontend_dist")


if FRONTEND_DIST.exists():

    # Serve Vite-generated static assets.
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets",
    )

    # Serve React application at the root URL.
    @app.get("/")
    def serve_frontend():
        return FileResponse(FRONTEND_DIST / "index.html")

    # React Router fallback.
    #
    # If the requested path is not an actual file, return
    # index.html so React Router can handle the route.
    @app.get("/{path:path}")
    def serve_react_route(path: str):
        requested_file = FRONTEND_DIST / path

        if requested_file.is_file():
            return FileResponse(requested_file)

        return FileResponse(FRONTEND_DIST / "index.html")

else:

    # Fallback used when the React production build has not
    # been copied into the backend container yet.
    @app.get("/")
    def root():
        return {
            "project": "MatterMind",
            "status": "Backend Running 🚀",
        }