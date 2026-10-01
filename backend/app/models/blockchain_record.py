from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.core.database import Base


class BlockchainRecord(Base):
    __tablename__ = "blockchain_records"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("materials.id"), nullable=False)

    block_hash = Column(String, nullable=False, unique=True)
    previous_hash = Column(String, nullable=True)
    transaction_type = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    material = relationship("Material")