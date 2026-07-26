from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.models.material import Material
from backend.app.schemas.analytics import (
    MaterialAnalyticsResponse,
    HealthAnalyticsResponse,
    CarbonAnalyticsResponse,
    SustainabilityAnalyticsResponse,
)


class AnalyticsService:
    @staticmethod
    def _apply_filters(
        query,
        manufacturer: Optional[str] = None,
        material_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        location: Optional[str] = None,
    ):
        if manufacturer:
            query = query.filter(Material.manufacturer.ilike(f"%{manufacturer}%"))
        if material_type:
            query = query.filter(Material.material_type.ilike(f"%{material_type}%"))
        if location:
            query = query.filter(Material.location.ilike(f"%{location}%"))
        if start_date:
            query = query.filter(Material.created_at >= start_date)
        if end_date:
            query = query.filter(Material.created_at <= end_date)
        return query

    @staticmethod
    def get_material_analytics(
        db: Session,
        manufacturer: Optional[str] = None,
        material_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        location: Optional[str] = None,
    ) -> MaterialAnalyticsResponse:
        query = AnalyticsService._apply_filters(
            db.query(Material),
            manufacturer,
            material_type,
            start_date,
            end_date,
            location,
        )
        materials = query.all()
        total_count = len(materials)

        by_type = {}
        by_status = {}
        by_category = {}

        for m in materials:
            m_type = m.material_type or "Unknown"
            by_type[m_type] = by_type.get(m_type, 0) + 1

            status_val = m.status or "Unknown"
            by_status[status_val] = by_status.get(status_val, 0) + 1

            cat_val = m.category or "Uncategorized"
            by_category[cat_val] = by_category.get(cat_val, 0) + 1

        return MaterialAnalyticsResponse(
            total_count=total_count,
            by_type=by_type,
            by_status=by_status,
            by_category=by_category,
        )

    @staticmethod
    def get_health_analytics(
        db: Session,
        manufacturer: Optional[str] = None,
        material_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        location: Optional[str] = None,
    ) -> HealthAnalyticsResponse:
        query = AnalyticsService._apply_filters(
            db.query(Material).filter(Material.health_score.isnot(None)),
            manufacturer,
            material_type,
            start_date,
            end_date,
            location,
        )
        scores = [m.health_score for m in query.all() if m.health_score is not None]
        if not scores:
            return HealthAnalyticsResponse(
                avg_health_score=0.0,
                min_health_score=None,
                max_health_score=None,
                distribution={"90-100": 0, "70-89": 0, "<70": 0},
            )

        avg_health = sum(scores) / len(scores)
        distribution = {"90-100": 0, "70-89": 0, "<70": 0}
        for s in scores:
            if s >= 90:
                distribution["90-100"] += 1
            elif s >= 70:
                distribution["70-89"] += 1
            else:
                distribution["<70"] += 1

        return HealthAnalyticsResponse(
            avg_health_score=round(avg_health, 2),
            min_health_score=round(min(scores), 2),
            max_health_score=round(max(scores), 2),
            distribution=distribution,
        )

    @staticmethod
    def get_carbon_analytics(
        db: Session,
        manufacturer: Optional[str] = None,
        material_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        location: Optional[str] = None,
    ) -> CarbonAnalyticsResponse:
        query = AnalyticsService._apply_filters(
            db.query(Material).filter(Material.carbon_score.isnot(None)),
            manufacturer,
            material_type,
            start_date,
            end_date,
            location,
        )
        scores = [m.carbon_score for m in query.all() if m.carbon_score is not None]
        if not scores:
            return CarbonAnalyticsResponse(
                avg_carbon_score=0.0,
                min_carbon_score=None,
                max_carbon_score=None,
                total_carbon_impact=0.0,
            )

        avg_carbon = sum(scores) / len(scores)
        total_carbon = sum(scores)

        return CarbonAnalyticsResponse(
            avg_carbon_score=round(avg_carbon, 2),
            min_carbon_score=round(min(scores), 2),
            max_carbon_score=round(max(scores), 2),
            total_carbon_impact=round(total_carbon, 2),
        )

    @staticmethod
    def get_sustainability_analytics(
        db: Session,
        manufacturer: Optional[str] = None,
        material_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        location: Optional[str] = None,
    ) -> SustainabilityAnalyticsResponse:
        query = AnalyticsService._apply_filters(
            db.query(Material),
            manufacturer,
            material_type,
            start_date,
            end_date,
            location,
        )
        materials = query.all()
        total = len(materials)
        if total == 0:
            return SustainabilityAnalyticsResponse(
                recyclable_count=0,
                non_recyclable_count=0,
                recyclability_rate_percentage=0.0,
            )

        recyclable = sum(1 for m in materials if m.is_recyclable)
        non_recyclable = total - recyclable
        rate = (recyclable / total) * 100.0

        return SustainabilityAnalyticsResponse(
            recyclable_count=recyclable,
            non_recyclable_count=non_recyclable,
            recyclability_rate_percentage=round(rate, 2),
        )
