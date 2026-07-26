from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.core.database import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    material_name = Column(String, nullable=False, index=True)
    material_type = Column(String, nullable=False, index=True)
    manufacturer = Column(String, nullable=True, index=True)
    manufacturer_id = Column(
        Integer, ForeignKey("manufacturers.id", ondelete="SET NULL"), nullable=True
    )
    density = Column(Float, nullable=True)
    health_score = Column(Float, nullable=True)
    carbon_score = Column(Float, nullable=True)
    status = Column(String, default="Active", index=True)
    category = Column(String, nullable=True, index=True)
    tags = Column(String, nullable=True, index=True)
    location = Column(String, nullable=True, index=True)
    is_recyclable = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    manufacturer_obj = relationship("Manufacturer", back_populates="materials")
    histories = relationship(
        "MaterialHistory", back_populates="material", cascade="all, delete-orphan"
    )