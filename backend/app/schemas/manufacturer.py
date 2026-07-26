from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


class ManufacturerBase(BaseModel):
    name: str
    code: Optional[str] = None
    country: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    website: Optional[str] = None
    is_active: Optional[bool] = True


class ManufacturerCreate(ManufacturerBase):
    pass


class ManufacturerUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    country: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    website: Optional[str] = None
    is_active: Optional[bool] = None


class ManufacturerResponse(ManufacturerBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
