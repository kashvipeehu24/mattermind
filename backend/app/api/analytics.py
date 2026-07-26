from typing import Optional, Any
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.analytics import (
    MaterialAnalyticsResponse,
    HealthAnalyticsResponse,
    CarbonAnalyticsResponse,
    SustainabilityAnalyticsResponse,
)
from backend.app.services.analytics_service import AnalyticsService
from backend.app.api.deps import get_current_active_user

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
    dependencies=[Depends(get_current_active_user)],
)


@router.get("/materials", response_model=MaterialAnalyticsResponse)
def get_material_analytics(
    manufacturer: Optional[str] = None,
    material_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
) -> Any:
    return AnalyticsService.get_material_analytics(
        db,
        manufacturer=manufacturer,
        material_type=material_type,
        start_date=start_date,
        end_date=end_date,
        location=location,
    )


@router.get("/health", response_model=HealthAnalyticsResponse)
def get_health_analytics(
    manufacturer: Optional[str] = None,
    material_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
) -> Any:
    return AnalyticsService.get_health_analytics(
        db,
        manufacturer=manufacturer,
        material_type=material_type,
        start_date=start_date,
        end_date=end_date,
        location=location,
    )


@router.get("/carbon", response_model=CarbonAnalyticsResponse)
def get_carbon_analytics(
    manufacturer: Optional[str] = None,
    material_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
) -> Any:
    return AnalyticsService.get_carbon_analytics(
        db,
        manufacturer=manufacturer,
        material_type=material_type,
        start_date=start_date,
        end_date=end_date,
        location=location,
    )


@router.get("/sustainability", response_model=SustainabilityAnalyticsResponse)
def get_sustainability_analytics(
    manufacturer: Optional[str] = None,
    material_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
) -> Any:
    return AnalyticsService.get_sustainability_analytics(
        db,
        manufacturer=manufacturer,
        material_type=material_type,
        start_date=start_date,
        end_date=end_date,
        location=location,
    )
