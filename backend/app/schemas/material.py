from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime


class MaterialBase(BaseModel):
    material_name: str
    material_type: str
    manufacturer: Optional[str] = None
    density: Optional[float] = None
    health_score: Optional[float] = None
    carbon_score: Optional[float] = None
    status: Optional[str] = "Active"
    category: Optional[str] = None
    tags: Optional[str] = None
    location: Optional[str] = None
    is_recyclable: Optional[bool] = False


class MaterialCreate(MaterialBase):
    pass


class MaterialUpdate(BaseModel):
    material_name: Optional[str] = None
    material_type: Optional[str] = None
    manufacturer: Optional[str] = None
    density: Optional[float] = None
    health_score: Optional[float] = None
    carbon_score: Optional[float] = None
    status: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    location: Optional[str] = None
    is_recyclable: Optional[bool] = None


class MaterialResponse(MaterialBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class MaterialSearchQuery(BaseModel):
    material_name: Optional[str] = None
    manufacturer: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[str] = None
    material_type: Optional[str] = None
    location: Optional[str] = None