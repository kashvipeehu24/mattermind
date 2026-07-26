from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime


class MaterialHistoryResponse(BaseModel):
    id: int
    material_id: int
    change_type: str
    changed_by_user_id: Optional[int] = None
    details: Optional[str] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class MaterialPassportResponse(BaseModel):
    passport_id: str
    material_id: int
    material_name: str
    material_type: str
    manufacturer: Optional[str] = None
    health_score: Optional[float] = None
    carbon_score: Optional[float] = None
    is_recyclable: bool
    status: str
    created_at: Optional[datetime] = None
    blockchain_hash: Optional[str] = None
    provenance_details: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)
