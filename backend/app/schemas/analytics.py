from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional


class MaterialAnalyticsResponse(BaseModel):
    total_count: int
    by_type: Dict[str, int]
    by_status: Dict[str, int]
    by_category: Dict[str, int]

    model_config = ConfigDict(from_attributes=True)


class HealthAnalyticsResponse(BaseModel):
    avg_health_score: float
    min_health_score: Optional[float] = None
    max_health_score: Optional[float] = None
    distribution: Dict[str, int]  # e.g., {"90-100": 5, "70-89": 3, "<70": 1}

    model_config = ConfigDict(from_attributes=True)


class CarbonAnalyticsResponse(BaseModel):
    avg_carbon_score: float
    min_carbon_score: Optional[float] = None
    max_carbon_score: Optional[float] = None
    total_carbon_impact: float

    model_config = ConfigDict(from_attributes=True)


class SustainabilityAnalyticsResponse(BaseModel):
    recyclable_count: int
    non_recyclable_count: int
    recyclability_rate_percentage: float

    model_config = ConfigDict(from_attributes=True)
