from sqlalchemy import Column, Integer, String, Float

from backend.app.core.database import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    material_name = Column(String, nullable=False)
    material_type = Column(String, nullable=False)
    manufacturer = Column(String)
    density = Column(Float)
    health_score = Column(Float)
    carbon_score = Column(Float)
    status = Column(String, default="Active")