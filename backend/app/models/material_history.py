from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.core.database import Base


class MaterialHistory(Base):
    __tablename__ = "material_histories"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(
        Integer, ForeignKey("materials.id", ondelete="CASCADE"), nullable=False, index=True
    )
    change_type = Column(String, nullable=False)  # "CREATED", "UPDATED", "STATUS_CHANGE", etc.
    changed_by_user_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    material = relationship("Material", back_populates="histories")
