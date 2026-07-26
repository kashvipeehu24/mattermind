from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from backend.app.core.database import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)

    material_name = Column(String, nullable=False, index=True)
    material_type = Column(String, nullable=False, index=True)

    manufacturer = Column(String, nullable=True, index=True)
    manufacturer_id = Column(
        Integer,
        ForeignKey("manufacturers.id", ondelete="SET NULL"),
        nullable=True,
    )

    density = Column(Float, nullable=True)
    health_score = Column(Float, nullable=True)
    carbon_score = Column(Float, nullable=True)

    status = Column(String, default="Active", index=True)

    # Existing hackathon fields
    batch_number = Column(String, nullable=True)
    manufacturing_date = Column(String, nullable=True)
    expiry_date = Column(String, nullable=True)
    location = Column(String, nullable=True, index=True)
    owner = Column(String, nullable=True)
    recyclability_score = Column(Float, nullable=True)
    sustainability_score = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    description = Column(String, nullable=True)

    category = Column(String, nullable=True, index=True)
    tags = Column(String, nullable=True, index=True)
    is_recyclable = Column(Boolean, default=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    manufacturer_obj = relationship(
        "Manufacturer",
        back_populates="materials",
    )

    histories = relationship(
        "MaterialHistory",
        back_populates="material",
        cascade="all, delete-orphan",
    )

    #analyses = relationship(
    #    "Analysis",
    #   back_populates="material",
    #   cascade="all, delete-orphan",
    #)