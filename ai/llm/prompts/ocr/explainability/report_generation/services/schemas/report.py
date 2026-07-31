"""Report schema definitions for MatterMind AI.

This module provides typed schemas for generated reports and serialization
helpers for report payloads.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional


@dataclass(frozen=True)
class ReportSchema:
    material_summary: Optional[str] = None
    condition_summary: Optional[str] = None
    sustainability_summary: Optional[str] = None
    risk_analysis: Optional[str] = None
    recommendations: Optional[str] = None
    executive_summary: Optional[str] = None

    def as_dict(self) -> Dict[str, Optional[str]]:
        return {
            "material_summary": self.material_summary,
            "condition_summary": self.condition_summary,
            "sustainability_summary": self.sustainability_summary,
            "risk_analysis": self.risk_analysis,
            "recommendations": self.recommendations,
            "executive_summary": self.executive_summary,
        }

    @classmethod
    def from_dict(cls, payload: Dict[str, Optional[str]]) -> "ReportSchema":
        return cls(
            material_summary=cls._normalize(payload.get("material_summary")),
            condition_summary=cls._normalize(payload.get("condition_summary")),
            sustainability_summary=cls._normalize(payload.get("sustainability_summary")),
            risk_analysis=cls._normalize(payload.get("risk_analysis")),
            recommendations=cls._normalize(payload.get("recommendations")),
            executive_summary=cls._normalize(payload.get("executive_summary")),
        )

    @staticmethod
    def _normalize(value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        normalized_value = value.strip()
        return normalized_value or None
