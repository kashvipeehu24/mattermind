from pydantic import BaseModel, ConfigDict
from typing import Optional


class DashboardSummaryResponse(BaseModel):
    total_materials: int
    active_materials: int
    expired_materials: int
    recyclable_materials: int
    avg_health_score: float
    avg_carbon_score: float
    total_manufacturers: int
    total_users: int

    model_config = ConfigDict(from_attributes=True)
