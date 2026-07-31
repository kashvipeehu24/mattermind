"""Recommendation schema definitions for MatterMind AI.

This module provides typed schemas for recommendation sections produced by
MatterMind’s AI recommendation engine.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional


@dataclass(frozen=True)
class RecommendationSchema:
    repair_recommendation: Optional[str] = None
    maintenance_recommendation: Optional[str] = None
    reuse_recommendation: Optional[str] = None
    recycling_recommendation: Optional[str] = None
    risk_summary: Optional[str] = None
    safety_warning: Optional[str] = None

    def as_dict(self) -> Dict[str, Optional[str]]:
        return {
            "repair_recommendation": self.repair_recommendation,
            "maintenance_recommendation": self.maintenance_recommendation,
            "reuse_recommendation": self.reuse_recommendation,
            "recycling_recommendation": self.recycling_recommendation,
            "risk_summary": self.risk_summary,
            "safety_warning": self.safety_warning,
        }

    @classmethod
    def from_dict(cls, payload: Dict[str, Optional[str]]) -> "RecommendationSchema":
        return cls(
            repair_recommendation=cls._normalize(payload.get("repair_recommendation")),
            maintenance_recommendation=cls._normalize(payload.get("maintenance_recommendation")),
            reuse_recommendation=cls._normalize(payload.get("reuse_recommendation")),
            recycling_recommendation=cls._normalize(payload.get("recycling_recommendation")),
            risk_summary=cls._normalize(payload.get("risk_summary")),
            safety_warning=cls._normalize(payload.get("safety_warning")),
        )

    @staticmethod
    def _normalize(value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        normalized_value = value.strip()
        return normalized_value or None
