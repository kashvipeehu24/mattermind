from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from backend.app.core.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)

    material_id = Column(
        Integer,
        ForeignKey("materials.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    analysis_type = Column(String(100), nullable=False)
    prediction = Column(String(255), nullable=False)
    confidence_score = Column(Float, nullable=False)

    recommendation = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)

    model_name = Column(String(100), nullable=True)
    model_version = Column(String(50), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    material = relationship(
        "Material",
        back_populates="analyses",
    )