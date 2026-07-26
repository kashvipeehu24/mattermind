from pydantic import BaseModel
from typing import Optional

class MaterialCreate(BaseModel):
    material_name: str
    material_type: str
    
from typing import Optional

manufacturer: Optional[str] = None
density: Optional[float] = None

class MaterialResponse(MaterialCreate):
    id: int
    status: str

from typing import Optional
health_score: Optional[float] = None
carbon_score: Optional[float] = None

class Config:
     from_attributes = True