from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any


class AIAnalyzeRequest(BaseModel):
    material_id: Optional[int] = None
    material_name: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None
    analysis_type: Optional[str] = "comprehensive"


class AIAnalyzeResponse(BaseModel):
    analysis_id: str
    material_name: str
    health_assessment: Dict[str, Any]
    carbon_footprint_estimate: Dict[str, Any]
    recommendations: List[str]
    confidence_score: float

    model_config = ConfigDict(from_attributes=True)


class AIPredictRequest(BaseModel):
    material_type: str
    target_attribute: str
    features: Dict[str, Any]


class AIPredictResponse(BaseModel):
    prediction_id: str
    target_attribute: str
    predicted_value: float
    confidence_interval: List[float]
    model_version: str

    model_config = ConfigDict(from_attributes=True)


class AIHistoryResponse(BaseModel):
    material_id: int
    analyses_count: int
    history: List[Dict[str, Any]]

    model_config = ConfigDict(from_attributes=True)
