from typing import Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.report_service import ReportService
from backend.app.api.deps import get_current_admin_user

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
    dependencies=[Depends(get_current_admin_user)],
)


@router.get("/materials")
def get_materials_report(
    format: str = Query("json", description="Report format: json, csv, or excel"),
    db: Session = Depends(get_db),
) -> Any:
    return ReportService.generate_material_report(db, format_type=format)


@router.get("/health")
def get_health_report(
    format: str = Query("json", description="Report format: json, csv, or excel"),
    db: Session = Depends(get_db),
) -> Any:
    return ReportService.generate_health_report(db, format_type=format)


@router.get("/carbon")
def get_carbon_report(
    format: str = Query("json", description="Report format: json, csv, or excel"),
    db: Session = Depends(get_db),
) -> Any:
    return ReportService.generate_carbon_report(db, format_type=format)


@router.get("/manufacturers")
def get_manufacturers_report(
    format: str = Query("json", description="Report format: json, csv, or excel"),
    db: Session = Depends(get_db),
) -> Any:
    return ReportService.generate_manufacturer_report(db, format_type=format)
