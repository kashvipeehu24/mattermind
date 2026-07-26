from sqlalchemy.orm import Session
from sqlalchemy import func, distinct

from backend.app.models.material import Material
from backend.app.models.user import User
from backend.app.schemas.dashboard import DashboardSummaryResponse


class DashboardService:
    @staticmethod
    def get_summary(db: Session) -> DashboardSummaryResponse:
        total_materials = db.query(func.count(Material.id)).scalar() or 0
        active_materials = (
            db.query(func.count(Material.id))
            .filter(Material.status.ilike("Active"))
            .scalar()
            or 0
        )
        expired_materials = (
            db.query(func.count(Material.id))
            .filter(Material.status.ilike("Expired"))
            .scalar()
            or 0
        )
        recyclable_materials = (
            db.query(func.count(Material.id))
            .filter(Material.is_recyclable == True)
            .scalar()
            or 0
        )

        avg_health = (
            db.query(func.avg(Material.health_score))
            .filter(Material.health_score.isnot(None))
            .scalar()
            or 0.0
        )
        avg_carbon = (
            db.query(func.avg(Material.carbon_score))
            .filter(Material.carbon_score.isnot(None))
            .scalar()
            or 0.0
        )

        total_manufacturers = (
            db.query(func.count(distinct(Material.manufacturer)))
            .filter(
                Material.manufacturer.isnot(None), Material.manufacturer != ""
            )
            .scalar()
            or 0
        )

        total_users = db.query(func.count(User.id)).scalar() or 0

        return DashboardSummaryResponse(
            total_materials=total_materials,
            active_materials=active_materials,
            expired_materials=expired_materials,
            recyclable_materials=recyclable_materials,
            avg_health_score=round(float(avg_health), 2),
            avg_carbon_score=round(float(avg_carbon), 2),
            total_manufacturers=total_manufacturers,
            total_users=total_users,
        )
