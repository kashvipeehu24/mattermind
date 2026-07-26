from sqlalchemy.orm import Session

from backend.app.models.analysis import Analysis
from backend.app.models.material import Material


class AIService:
    def __init__(self, db: Session):
        self.db = db

    def analyze_material(self, material_id: int):
        material = (
            self.db.query(Material)
            .filter(Material.id == material_id)
            .first()
        )

        if material is None:
            return None

        health = material.health_score or 0
        carbon = material.carbon_score or 0

        if health >= 80:
            recommendation = "Reuse"
            prediction = "Excellent"
        elif health >= 50:
            recommendation = "Repair"
            prediction = "Good"
        else:
            recommendation = "Recycle"
            prediction = "Poor"

        confidence = round(
            ((health + (100 - carbon)) / 2),
            2,
        )

        analysis = Analysis(
            material_id=material.id,
            analysis_type="Material Health",
            prediction=prediction,
            confidence_score=confidence,
            recommendation=recommendation,
            explanation="Rule-based AI analysis",
            model_name="MatterMind Rule Engine",
            model_version="1.0",
        )

        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)

        return analysis

    def get_history(self, material_id: int):
        return (
            self.db.query(Analysis)
            .filter(Analysis.material_id == material_id)
            .all()
        )