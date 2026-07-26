from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.ai_service import AIService

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post("/analyze/{material_id}")
def analyze_material(
    material_id: int,
    db: Session = Depends(get_db),
):
    service = AIService(db)

    analysis = service.analyze_material(material_id)

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Material not found",
        )

    return analysis


@router.get("/history/{material_id}")
def get_analysis_history(
    material_id: int,
    db: Session = Depends(get_db),
):
    service = AIService(db)
    return service.get_history(material_id)