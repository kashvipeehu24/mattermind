<<<<<<< Updated upstream
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
=======
from sqlalchemy import Column, Integer, String, Float, DateTime
>>>>>>> Stashed changes

from backend.app.core.database import Base
from datetime import datetime


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
<<<<<<< Updated upstream
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
=======
    material_name = Column(String, nullable=False)
    material_type = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    density = Column(Float)
    health_score = Column(Float)
    carbon_score = Column(Float)
    status = Column(String, default="Active")
    batch_number = Column(String)
    manufacturing_date = Column(String)
    expiry_date = Column(String)
    location = Column(String)
    owner = Column(String)
    recyclability_score = Column(Float)
    sustainability_score = Column(Float)
    weight = Column(Float)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
>>>>>>> Stashed changes
